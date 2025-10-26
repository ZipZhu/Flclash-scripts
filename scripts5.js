function main(config) {
  const originalProxies = config.proxies || [];

  const filterKeywords = ['群', '邀请', '返利', '循环', '官网', '客服', '网站', '网址', '获取', '订阅', '流量', '到期', '续费', '购买', '机场', '下次', '版本', '官址', '备用', '过期', '已用', '联系', '邮箱', '工单', '贩卖', '通知', '倒卖', '防止', '国内', '建议', '地址', '频道', '无法', '说明', '使用', '提示', '特别', '访问', '支持', '10x', '8x', '6x'];
  const keywordRegex = new RegExp(filterKeywords.join('|'));
  
  const allProxies = originalProxies.filter(proxy => !keywordRegex.test(proxy.name));

  if (allProxies.length === 0) {
    return config;
  }

  const ICON_BASE = "https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/";
  const URL_TEST_DEFAULT = { interval: 300, tolerance: 50 };

  const regionFilters = {
    "美国节点": {
      icon: `${ICON_BASE}United_States.png`,
      filter: "美|波特兰|达拉斯|俄勒冈|凤凰城|费利蒙|硅谷|拉斯维加斯|洛杉矶|圣何塞|圣克拉拉|西雅图|芝加哥|US|us|Us|uS|United States|united states|United states|UNITED STATES|UNITED STATES"
    },
    "日本节点": {
      icon: `${ICON_BASE}Japan.png`,
      filter: "日本|川日|东京|大阪|泉日|埼玉|沪日|深日|JP|jp|Jp|jP|Japan|JAPAN|japan|JAPAN"
    },
    "狮城节点": {
      icon: `${ICON_BASE}Singapore.png`,
      filter: "新加坡|坡|狮城|SG|sg|Sg|sG|Singapore|SINGAPORE|singapore"
    },
    "香港节点": {
      icon: `${ICON_BASE}Hong_Kong.png`,
      filter: "港|HK|hk|Hk|hK|Hong Kong|HONG KONG|Hong kong|HONG kong|hong kong"
    },
    "台湾节点": {
      icon: `${ICON_BASE}Taiwan.png`,
      filter: "台|新北|彰化|TW|tw|Tw|tW|Taiwan|TAIWAN|taiwan|TAIWAN"
    }
  };

  const compiledFilters = Object.entries(regionFilters).map(([name, { filter }]) => ({
    name: name,
    regex: new RegExp(filter)
  }));

  const foundRegions = new Set();

  for (const proxy of allProxies) {
    for (const filter of compiledFilters) {
      if (filter.regex.test(proxy.name)) {
        foundRegions.add(filter.name);
        break;
      }
    }
  }

  const availableRegionsList = Object.keys(regionFilters).filter(name => foundRegions.has(name));

  const mainProxiesList = [
    "节点选择",
    ...availableRegionsList,
    "手动切换",
    "DIRECT"
  ];

  const proxyGroups = [
    {
      name: "节点选择",
      icon: `${ICON_BASE}Proxy.png`,
      type: "select",
      proxies: [
        ...availableRegionsList,
        "手动切换"
      ]
    }
  ];

  for (const regionName of availableRegionsList) {
    const regionConfig = regionFilters[regionName];
    proxyGroups.push({
      name: regionName,
      icon: regionConfig.icon,
      "include-all": true,
      filter: regionConfig.filter,
      type: "url-test",
      ...URL_TEST_DEFAULT
    });
  }

  proxyGroups.push({
    name: "手动切换",
    icon: "https://cdn.jsdelivr.net/gh/shindgewongxj/WHATSINStash@master/icon/select.png",
    "include-all": true,
    type: "select"
  });
 
  proxyGroups.push({
    name: "GLOBAL",
    icon: "https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Global.png",
    type: "select",
    proxies: mainProxiesList
  });

  config["proxy-groups"] = proxyGroups;

  config["rule-providers"] = {
    LocalAreaNetwork: { url: "https://cdn.jsdelivr.net/gh/ACL4SSR/ACL4SSR@master/Clash/LocalAreaNetwork.list", path: "./ruleset/LocalAreaNetwork.list", behavior: "classical", interval: 86400, format: "text", type: "http" },
    UnBan: { url: "https://cdn.jsdelivr.net/gh/ACL4SSR/ACL4SSR@master/Clash/UnBan.list", path: "./ruleset/UnBan.list", behavior: "classical", interval: 86400, format: "text", type: "http" },
    BanAD: { url: "https://cdn.jsdelivr.net/gh/ACL4SSR/ACL4SSR@master/Clash/BanAD.list", path: "./ruleset/BanAD.list", behavior: "classical", interval: 86400, format: "text", type: "http" },
    BanProgramAD: { url: "https://cdn.jsdelivr.net/gh/ACL4SSR/ACL4SSR@master/Clash/BanProgramAD.list", path: "./ruleset/BanProgramAD.list", behavior: "classical", interval: 86400, format: "text", type: "http" },
    ProxyGFWlist: { url: "https://cdn.jsdelivr.net/gh/ACL4SSR/ACL4SSR@master/Clash/ProxyGFWlist.list", path: "./ruleset/ProxyGFWlist.list", behavior: "classical", interval: 86400, format: "text", type: "http" },
    ChinaDomain: { url: "https://cdn.jsdelivr.net/gh/ACL4SSR/ACL4SSR@master/Clash/ChinaDomain.list", path: "./ruleset/ChinaDomain.list", behavior: "domain", interval: 86400, format: "text", type: "http" },
    ChinaCompanyIp: { url: "https://cdn.jsdelivr.net/gh/ACL4SSR/ACL4SSR@master/Clash/ChinaCompanyIp.list", path: "./ruleset/ChinaCompanyIp.list", behavior: "ipcidr", interval: 86400, format: "text", type: "http" },
    Download: { url: "https://cdn.jsdelivr.net/gh/ACL4SSR/ACL4SSR@master/Clash/Download.list", path: "./ruleset/Download.list", behavior: "classical", interval: 86400, format: "text", type: "http" }
  };

  config["rules"] = [
    "RULE-SET,LocalAreaNetwork,DIRECT",
    "RULE-SET,UnBan,DIRECT",
    "RULE-SET,BanAD,REJECT",
    "RULE-SET,BanProgramAD,REJECT",
    "RULE-SET,ProxyGFWlist,节点选择",
    "RULE-SET,ChinaDomain,DIRECT",
    "RULE-SET,ChinaCompanyIp,DIRECT",
    "RULE-SET,Download,DIRECT",
    "GEOIP,CN,DIRECT",
    "MATCH,节点选择"
  ];

  config.proxies = allProxies;

  return config;
}
