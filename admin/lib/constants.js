/**
 * AIDC Collector — localStorage 键名常量
 * 两端必须使用完全相同的键名，以保证数据互通。
 */
(function (global) {
  'use strict';

  var K = {
    user:        'aidc_user',        // 当前登录用户
    users:       'aidc_users',        // 用户列表（含 password，明文存储仅本地）
    datacenters: 'aidc_datacenters',  // 机房列表
    customers:   'aidc_customers',    // 客户/服务商列表
    changelogs:  'aidc_changelogs',   // 操作日志
    visits:      'aidc_visits',       // 考察记录
    loginLogs:   'aidc_loginLogs',    // 登录日志（桌面端使用）
  };

  // 机房状态定义
  var STATUS = {
    NEW:         'new',
    COLLECTED:   'collected',
    NEGOTIATING: 'negotiating',
    SIGNED:      'signed',
    REJECTED:    'rejected',
  };

  // KYC 状态定义
  var KYC_STATUS = {
    APPROVED:    'approved',
    IN_PROGRESS: 'in_progress',
    PENDING:     'pending',
    PENDING_DOC: 'pending_doc',
    NOT_STARTED: 'not_started',
  };

  // 用户角色
  var ROLE = {
    ADMIN:     'admin',
    COLLECTOR: 'collector',
  };

  // 国家列表（东南亚 IDC 常用）
  var COUNTRIES = [
    '新加坡', '泰国', '印尼', '越南', '马来西亚',
    '菲律宾', '澳大利亚', '日本', '中国', '中国香港',
    '中国台湾', '韩国', '印度', '美国', '其他'
  ];

  // 机房状态标签映射
  var STATUS_LABELS = {};
  STATUS_LABELS[STATUS.NEW]         = { label: '新增',    cls: 'info'    };
  STATUS_LABELS[STATUS.COLLECTED]   = { label: '已收录',  cls: 'success' };
  STATUS_LABELS[STATUS.NEGOTIATING] = { label: '洽谈中',  cls: 'warning' };
  STATUS_LABELS[STATUS.SIGNED]      = { label: '已签约',  cls: 'accent'  };
  STATUS_LABELS[STATUS.REJECTED]    = { label: '已淘汰',  cls: 'danger'  };

  // KYC 状态标签映射
  var KYC_LABELS = {};
  KYC_LABELS[KYC_STATUS.APPROVED]    = { label: '已通过',  cls: 'success' };
  KYC_LABELS[KYC_STATUS.IN_PROGRESS] = { label: '审核中',  cls: 'warning' };
  KYC_LABELS[KYC_STATUS.PENDING]     = { label: '待提交',  cls: 'info'    };
  KYC_LABELS[KYC_STATUS.PENDING_DOC] = { label: '缺资料',  cls: 'warning' };
  KYC_LABELS[KYC_STATUS.NOT_STARTED] = { label: '未开始',  cls: 'info'    };

  // 国家国旗 emoji
  var COUNTRY_FLAGS = {
    '新加坡': '🇸🇬', '泰国': '🇹🇭', '印尼': '🇮🇩', '越南': '🇻🇳',
    '马来西亚': '🇲🇾', '菲律宾': '🇵🇭', '澳大利亚': '🇦🇺', '日本': '🇯🇵',
    '中国': '🇨🇳', '中国香港': '🇭🇰', '中国台湾': '🇹🇼', '韩国': '🇰🇷',
    '印度': '🇮🇳', '美国': '🇺🇸', '其他': '🌐'
  };

  // 导出到全局
  global.AIDC_CONST = {
    K:            K,
    STATUS:       STATUS,
    KYC_STATUS:   KYC_STATUS,
    ROLE:         ROLE,
    COUNTRIES:    COUNTRIES,
    STATUS_LABELS: STATUS_LABELS,
    KYC_LABELS:   KYC_LABELS,
    COUNTRY_FLAGS: COUNTRY_FLAGS,
  };

})(window);
