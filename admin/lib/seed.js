/**
 * AIDC Collector — 种子数据
 * 首次使用 localStorage 时自动初始化。
 * 两端共用同一份种子，保证数据一致性。
 */
(function () {
  'use strict';

  var K = window.AIDC_CONST.K;

  function now() { return new Date().toISOString(); }

  // ── 用户种子 ──────────────────────────────────────────────────────
  function seedUsers() {
    if (localStorage.getItem(K.users)) return;
    localStorage.setItem(K.users, JSON.stringify([
      { id: 'u001', name: '管理员', username: 'admin',    phone: '13800000001', password: 'Admin@2026',   role: 'admin',     status: 'active',   createdAt: now() },
      { id: 'u002', name: '张三',   username: 'zhangsan', phone: '13800000002', password: 'Abc@12345',   role: 'collector', status: 'active',   createdAt: now() },
      { id: 'u003', name: '李四',   username: 'lisi',     phone: '13800000003', password: 'Abc@12345',   role: 'collector', status: 'disabled', createdAt: now() },
    ]));
  }

  // ── 机房种子（按创建日期分布，覆盖上周到今天）─────────────────────
  function seedDatacenters() {
    if (localStorage.getItem(K.datacenters)) return;
    var t = Date.now();
    var d = function(days) { return new Date(t - days * 86400000).toISOString(); };

    localStorage.setItem(K.datacenters, JSON.stringify([
      // ── 本周新增 ──
      { id: 'dc001', name: 'Equinix SG2',           country: '新加坡',    province: '新加坡',    city: '新加坡',    address: '1 Genting Lane, Singapore 349544',       status: 'collected',   customer: 'Equinix',        rackCount: 1800, powerPerRack: 10, pue: 1.35, kycStatus: 'approved',    remark: '新加坡核心交换节点',                   kycRemark: 'KYC审核通过',       createdBy: 'u001', createdByName: '管理员', createdAt: d(5), updatedAt: now() },
      { id: 'dc002', name: 'STT Bangkok 1',          country: '泰国',      province: '曼谷',      city: '曼谷',      address: 'Bang Khen District, Bangkok 10220',       status: 'new',         customer: 'STT GDC',      rackCount: 800,  powerPerRack: 10, pue: 1.42, kycStatus: 'pending',     remark: '曼谷重要节点',                           kycRemark: '待补充资料',        createdBy: 'u001', createdByName: '管理员', createAt: d(2), updatedAt: now() },
      { id: 'dc003', name: 'DCI Indonesia JK01',    country: '印尼',      province: '雅加达',    city: '雅加达',    address: 'Jl. Kebayoran Lama, Jakarta Barat',         status: 'collected',   customer: 'DCI',           rackCount: 600,  powerPerRack: 6,  pue: 1.5,  kycStatus: 'approved',    remark: '雅加达核心',                             kycRemark: '',                 createdBy: 'u002', createdByName: '张三',   createdAt: d(1), updatedAt: now() },
      { id: 'dc010', name: 'NTT Jakarta 2',           country: '印尼',      province: '雅加达',    city: '雅加达',    address: 'Kuningan, Jakarta Selatan',                status: 'new',         customer: 'NTT',           rackCount: 1200, powerPerRack: 12, pue: 1.28, kycStatus: 'in_progress', remark: '液冷机房，AI就绪',                     kycRemark: '缺营业执照',        createdBy: 'u001', createdByName: '管理员', createdAt: d(0), updatedAt: now() },
      { id: 'dc011', name: 'Keppel DC SG3',           country: '新加坡',    province: '新加坡',    city: '新加坡',    address: '25 Serangoon North Ave 7, Singapore',       status: 'new',         customer: 'Keppel DC',    rackCount: 1500, powerPerRack: 15, pue: 1.25, kycStatus: 'pending',     remark: '新建机房，容量充足',                   kycRemark: '',                 createdBy: 'u002', createdByName: '张三',   createdAt: d(0), updatedAt: now() },
      // ── 洽谈中 ──
      { id: 'dc004', name: 'Supernap Thailand 1',    country: '泰国',      province: '春武里',    city: '春武里',    address: 'Amata City, Chonburi',                     status: 'negotiating', customer: 'Supernap',     rackCount: 2000, powerPerRack: 15, pue: 1.38, kycStatus: 'in_progress', remark: 'TCC集团项目，液冷改造中',              kycRemark: '已补材料',           createdBy: 'u001', createdByName: '管理员', createdAt: d(0), updatedAt: now() },
      { id: 'dc012', name: 'Digital Realty SIN3',    country: '新加坡',    province: '新加坡',    city: '新加坡',    address: '1 Sunview Road, Singapore',                status: 'negotiating', customer: 'Digital Realty', rackCount: 2200, powerPerRack: 14, pue: 1.22, kycStatus: 'approved',    remark: 'Tier IV认证，价格较高',               kycRemark: '',                 createdBy: 'u001', createdByName: '管理员', createdAt: d(1), updatedAt: now() },
      // ── 已签约 ──
      { id: 'dc005', name: 'Keppel DC Singapore 2',  country: '新加坡',    province: '新加坡',    city: '新加坡',    address: '55 Ayer Rajah Crescent, Singapore',          status: 'signed',      customer: 'Keppel DC',    rackCount: 2500, powerPerRack: 12, pue: 1.3,  kycStatus: 'approved',    remark: '关灯哥重点项目',                         kycRemark: '',                 createdBy: 'u002', createdByName: '张三',   createdAt: d(3), updatedAt: now() },
      { id: 'dc013', name: 'AirTrunk SYD-2',          country: '澳大利亚',  province: '新南威尔士', city: '悉尼',      address: 'Sydney Olympic Park, NSW',                  status: 'signed',      customer: 'AirTrunk',     rackCount: 3500, powerPerRack: 14, pue: 1.28, kycStatus: 'approved',    remark: '超大规模，部署中',                       kycRemark: '',                 createdBy: 'u001', createdByName: '管理员', createdAt: d(2), updatedAt: now() },
      // ── 已收录（存量大）──
      { id: 'dc006', name: 'AirTrunk SYD-1',          country: '澳大利亚',  province: '新南威尔士', city: '悉尼',      address: 'Sydney Olympic Park, NSW',                  status: 'new',         customer: 'AirTrunk',     rackCount: 3000, powerPerRack: 12, pue: 1.3,  kycStatus: 'pending',     remark: '超大规模项目',                           kycRemark: '',                 createdBy: 'u001', createByName: '管理员', createdAt: d(0), updatedAt: now() },
      { id: 'dc014', name: 'NTT Tokyo 1',             country: '日本',      province: '东京都',    city: '东京',      address: 'Tama City, Tokyo',                          status: 'collected',   customer: 'NTT',           rackCount: 1800, powerPerRack: 10, pue: 1.32, kycStatus: 'approved',    remark: '东京核心节点',                           kycRemark: '',                 createdBy: 'u002', createByName: '张三',   createdAt: d(4), updatedAt: now() },
      { id: 'dc015', name: 'GDS Shanghai 1',           country: '中国',      province: '上海',      city: '上海',      address: 'Pudong New Area, Shanghai',                 status: 'collected',   customer: 'GDS',           rackCount: 2500, powerPerRack: 11, pue: 1.35, kycStatus: 'approved',    remark: '上海核心机房',                           kycRemark: '',                 createdBy: 'u001', createByName: '管理员', createdAt: d(6), updatedAt: now() },
      // ── 已淘汰 ──
      { id: 'dc016', name: 'Small DC Vietnam',        country: '越南',      province: '胡志明市',  city: '胡志明市',  address: 'District 7, Ho Chi Minh City',             status: 'rejected',    customer: 'Local ISP',   rackCount: 200,  powerPerRack: 4,  pue: 1.8,  kycStatus: 'not_started', remark: '基础设施弱，不推荐',                   kycRemark: '承重不足，电力冗余低', createdBy: 'u001', createByName: '管理员', createdAt: d(3), updatedAt: now() },
    ]));
  }

  // ── 初始化入口 ───────────────────────────────────────────────────
  window.AIDC_SEED = {
    init: function () {
      seedUsers();
      seedDatacenters();
    },
    reset: function () {
      // 清除全部数据并重新播种（用于调试）
      Object.values(K).forEach(function (key) {
        localStorage.removeItem(key);
      });
      this.init();
      console.log('[AIDC_SEED] 种子数据已重置');
    }
  };

})();
