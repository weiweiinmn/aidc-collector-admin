/**
 * AIDC Collector — 统一数据层 API
 *
 * localStorage 键名由 AIDC_CONST.K 统一管理，保证手机端和桌面端完全兼容。
 * 未来替换为真实云函数时，只需改写各方法的内部实现，不影响接口契约。
 *
 * 用法：
 *   <script src="constants.js"><\/script>
 *   <script src="seed.js"><\/script>
 *   <script src="api.js"><\/script>
 *   AIDC_SEED.init();   // 初始化种子数据（仅首次）
 *   await AIDC_API.login(u, p);
 */
(function () {
  'use strict';

  var K = window.AIDC_CONST.K;

  // ── 内部工具 ──────────────────────────────────────────────────────────
  function uid()  { return 'u' + Date.now(); }
  function now()  { return new Date().toISOString(); }

  function getUser() {
    try { return JSON.parse(localStorage.getItem(K.user) || 'null'); }
    catch (e) { return null; }
  }

  function isLoggedIn() { return !!getUser(); }
  function isAdmin()     { var u = getUser(); return !!(u && u.role === 'admin'); }

  // 软删除过滤
  function activeList(key) {
    return JSON.parse(localStorage.getItem(key) || '[]').filter(function (d) { return !d._deleted; });
  }

  // ── 变更日志 ──────────────────────────────────────────────────────────
  function addChangelog(dcId, dcName, type, content, operatorName) {
    var logs = JSON.parse(localStorage.getItem(K.changelogs) || '[]');
    var u    = getUser();
    logs.unshift({
      id:           'cl' + Date.now(),
      dcId:         dcId,
      dcName:       dcName,
      type:         type,
      content:      content,
      operatorName: operatorName || (u ? u.name : '未知'),
      operatorId:   u ? u.id : '',
      createdAt:    now()
    });
    localStorage.setItem(K.changelogs, JSON.stringify(logs));
  }

  function getChangelogs(dcId) {
    return JSON.parse(localStorage.getItem(K.changelogs) || '[]').filter(function (c) { return c.dcId === dcId; });
  }

  // ── Promise 响应封装 ───────────────────────────────────────────────────
  function ok(data)  { return Promise.resolve({ code: 0, data: data }); }
  function err(msg)  { return Promise.resolve({ code: 1, message: msg }); }

  // ══ AIDC_API ════════════════════════════════════════════════════════════
  window.AIDC_API = {

    // ── 用户 & 认证 ──────────────────────────────────────────────────────
    login: function (username, password) {
      var self = this;
      return new Promise(function (resolve) {
        setTimeout(function () {
          var users = JSON.parse(localStorage.getItem(K.users) || '[]');
          var user  = users.find(function (u) { return u.username === username; });
          if (!user)                                        { resolve(err('用户名不存在')); return; }
          if (user.password && user.password !== password)   { resolve(err('密码错误'));      return; }
          if (user.status === 'disabled')                   { resolve(err('账号已被停用'));  return; }
          user.lastLoginAt = now();
          localStorage.setItem(K.users, JSON.stringify(users));
          var u2 = Object.assign({}, user);
          delete u2.password;
          localStorage.setItem(K.user, JSON.stringify(u2));
          resolve(ok(u2));
        }, 300);
      });
    },

    logout: function () {
      localStorage.removeItem(K.user);
      return ok({});
    },

    getUser:      function () { return getUser(); },
    isLoggedIn:   function () { return isLoggedIn(); },
    isAdmin:      function () { return isAdmin(); },

    // ── 机房 CRUD ───────────────────────────────────────────────────────
    /**
     * 获取机房列表（支持筛选）
     * @param {Object} params
     * @param {string} params.keyword   — 模糊搜索（名称/地址/客户/城市）
     * @param {string} params.status    — 状态筛选
     * @param {string} params.country   — 国家筛选
     * @param {string} params.createdBy — 创建人 ID 筛选
     */
    getDatacenters: function (params) {
      params = params || {};
      var list = activeList(K.datacenters);

      if (params.keyword) {
        var kw = params.keyword.toLowerCase();
        list = list.filter(function (d) {
          return (d.name     || '').toLowerCase().includes(kw) ||
                 (d.address  || '').toLowerCase().includes(kw) ||
                 (d.customer || '').toLowerCase().includes(kw) ||
                 (d.city      || '').toLowerCase().includes(kw);
        });
      }
      if (params.status)    list = list.filter(function (d) { return d.status    === params.status;    });
      if (params.country)   list = list.filter(function (d) { return d.country   === params.country;   });
      if (params.createdBy) list = list.filter(function (d) { return d.createdBy === params.createdBy; });

      return ok({ list: list, total: list.length });
    },

    /** 根据 ID 获取单条机房 */
    getDatacenter: function (id) {
      var list = activeList(K.datacenters);
      var item = list.find(function (d) { return d.id === id; });
      if (!item) return err('记录不存在');
      return ok(item);
    },

    /** 新增机房 */
    createDatacenter: function (data) {
      var user   = getUser();
      var record = Object.assign({
        id:            'dc' + Date.now(),
        status:        'new',
        createdBy:     user ? user.id       : 'u001',
        createdByName: user ? user.name      : '管理员',
        createdAt:     now(),
        updatedAt:     now(),
      }, data);

      var list = JSON.parse(localStorage.getItem(K.datacenters) || '[]');
      list.unshift(record);
      localStorage.setItem(K.datacenters, JSON.stringify(list));

      addChangelog(record.id, record.name, 'create',
        '新增机房 [' + (record.name || '') + ']',
        user ? user.name : '管理员');

      return ok(record);
    },

    /** 更新机房（自动记录变更字段到 changelog）*/
    updateDatacenter: function (id, data) {
      var list = JSON.parse(localStorage.getItem(K.datacenters) || '[]');
      var idx  = list.findIndex(function (d) { return d.id === id; });
      if (idx === -1) return err('记录不存在');

      var oldRecord     = list[idx];
      var changedFields = [];
      Object.keys(data).forEach(function (key) {
        if (oldRecord[key] !== data[key]) changedFields.push(key);
      });

      list[idx] = Object.assign({}, oldRecord, data, { updatedAt: now() });
      localStorage.setItem(K.datacenters, JSON.stringify(list));

      if (changedFields.length > 0) {
        addChangelog(list[idx].id, list[idx].name, 'update',
          '更新字段：' + changedFields.join('、'),
          getUser() ? getUser().name : '未知');
      }
      return ok(list[idx]);
    },

    /** 软删除机房（不真正移除，标记 _deleted=true）*/
    deleteDatacenter: function (id) {
      var list = JSON.parse(localStorage.getItem(K.datacenters) || '[]');
      var idx  = list.findIndex(function (d) { return d.id === id; });
      if (idx === -1) return err('记录不存在');
      list[idx] = Object.assign({}, list[idx], {
        _deleted:  true,
        deletedAt: now(),
        deletedBy: getUser() ? getUser().id : '',
      });
      localStorage.setItem(K.datacenters, JSON.stringify(list));
      addChangelog(list[idx].id, list[idx].name, 'delete', '软删除机房记录', getUser() ? getUser().name : '未知');
      return ok({});
    },

    /** 获取单条机房的所有操作日志 */
    getDatacenterChangelogs: function (dcId) {
      return ok(getChangelogs(dcId));
    },

    // ── 仪表盘统计 ─────────────────────────────────────────────────────
    getStats: function () {
      var all       = activeList(K.datacenters);
      var today     = new Date().toDateString();
      var monthStart = new Date(); monthStart.setDate(1); monthStart.setHours(0,0,0,0);
      var weekStart  = new Date(); weekStart.setDate(weekStart.getDate() - (weekStart.getDay()||7) + 1); weekStart.setHours(0,0,0,0);
      var statusDist = {};
      all.forEach(function (d) { statusDist[d.status] = (statusDist[d.status]||0) + 1; });

      return ok({
        total:      all.length,
        todayCount: all.filter(function (d) { return new Date(d.createdAt).toDateString() === today;   }).length,
        weekCount:  all.filter(function (d) { return new Date(d.createdAt) >= weekStart;             }).length,
        monthCount: all.filter(function (d) { return new Date(d.createdAt) >= monthStart;             }).length,
        myCount:    all.filter(function (d) { return d.createdBy === (getUser()||{}).id;             }).length,
        statusDist: statusDist,
      });
    },

    // ── 状态映射（与 constants.js 保持同步）────────────────────────────
    getStatusLabel: function (status) {
      var m = window.AIDC_CONST.STATUS_LABELS[status];
      return m ? m.label : status || '未知';
    },
    getStatusCls: function (status) {
      var m = window.AIDC_CONST.STATUS_LABELS[status];
      return m ? m.cls : 'info';
    },
    getKycLabel: function (status) {
      var m = window.AIDC_CONST.KYC_LABELS[status];
      return m ? m.label : status || '—';
    },
    getCountryFlag: function (country) {
      return window.AIDC_CONST.COUNTRY_FLAGS[country] || '🌐';
    },

  }; // end AIDC_API

})();
