function main(config) {
  const originalProxies = config.proxies || [];

const filterKeywords=['群','邀请','返利','官网','官方','网址','订阅','购买','续费','剩余','到期','过期','流量','备用','邮箱','客服','联系','工单','倒卖','防止','机场','节点','代理','梯子','tg'];

  const keywordRegex = new RegExp(filterKeywords.join('|'), 'i');
  const allProxies = originalProxies.filter(proxy => !keywordRegex.test(proxy.name));
  if (allProxies.length === 0) return config;

  const ICON_BASE = "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/";
  const RULE_BASE = "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/";
  const URL_TEST_DEFAULT = { interval: 300, tolerance: 50 };

  const regionFilters = {
    "美国节点": {
      icon: `${ICON_BASE}United_States.png`,
      filter: "美|波特兰|达拉斯|俄勒冈|凤凰城|费利蒙|硅谷|拉斯维加斯|洛杉矶|圣何塞|圣克拉拉|西雅图|芝加哥|US|United States"
    },
    "日本节点": {
      icon: `${ICON_BASE}Japan.png`,
      filter: "日本|东京|大阪|JP|Japan"
    },
    "狮城节点": {
      icon: `${ICON_BASE}Singapore.png`,
      filter: "新加坡|狮城|SG|Singapore"
    },
    "香港节点": {
      icon: `${ICON_BASE}Hong_Kong.png`,
      filter: "港|HK|Hong Kong"
    },
    "台湾节点": {
      icon: `${ICON_BASE}Taiwan.png`,
      filter: "台|新北|彰化|TW|Taiwan"
    }
  };

  const compiledFilters = Object.entries(regionFilters).map(([name, { filter }]) => ({
    name: name,
    regex: new RegExp(filter, 'i')
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
  const mainProxiesList = ["节点选择", ...availableRegionsList, "手动切换", "DIRECT"];

  const proxyGroups = [
    {
      name: "节点选择",
      icon: `${ICON_BASE}Proxy.png`,
      type: "select",
      proxies: [...availableRegionsList, "手动切换"]
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
    icon: `${ICON_BASE}Available.png`,
    "include-all": true,
    type: "select"
  });

  proxyGroups.push({
    name: "GLOBAL",
    icon: `${ICON_BASE}Global.png`,
    type: "select",
    proxies: mainProxiesList
  });

  config["proxy-groups"] = proxyGroups;

  config["rule-providers"] = {
    LocalAreaNetwork: { url: `${RULE_BASE}LocalAreaNetwork.list`, path: "./ruleset/LocalAreaNetwork.list", behavior: "classical", interval: 86400, format: "text", type: "http" },
    UnBan: { url: `${RULE_BASE}UnBan.list`, path: "./ruleset/UnBan.list", behavior: "classical", interval: 86400, format: "text", type: "http" },
    BanAD: { url: `${RULE_BASE}BanAD.list`, path: "./ruleset/BanAD.list", behavior: "classical", interval: 86400, format: "text", type: "http" },
    BanProgramAD: { url: `${RULE_BASE}BanProgramAD.list`, path: "./ruleset/BanProgramAD.list", behavior: "classical", interval: 86400, format: "text", type: "http" },
    ProxyGFWlist: { url: `${RULE_BASE}ProxyGFWlist.list`, path: "./ruleset/ProxyGFWlist.list", behavior: "classical", interval: 86400, format: "text", type: "http" },
    ChinaDomain: { url: `${RULE_BASE}ChinaDomain.list`, path: "./ruleset/ChinaDomain.list", behavior: "domain", interval: 86400, format: "text", type: "http" },
    ChinaCompanyIp: { url: `${RULE_BASE}ChinaCompanyIp.list`, path: "./ruleset/ChinaCompanyIp.list", behavior: "ipcidr", interval: 86400, format: "text", type: "http" },
    Download: { url: `${RULE_BASE}Download.list`, path: "./ruleset/Download.list", behavior: "classical", interval: 86400, format: "text", type: "http" }
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
