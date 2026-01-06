function main(config) {
  const ICON_BASE = "https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/";
  const RULE_BASE = "https://cdn.jsdelivr.net/gh/ACL4SSR/ACL4SSR@master/Clash/";

  const maxRatio = 3.0;
  const ratioRegex = /(?:\[(\d+(?:\.\d+)?)\s*(?:x|X|×)\]|(\d+(?:\.\d+)?)\s*(?:x|X|×|倍)|(?:x|X|×|倍)\s*(\d+(?:\.\d+)?))/i;

  const filterKeywords = [
    '群', '邀请', '返利', '官网', '官方', '网址', '订阅', '购买', '续费', '剩余',
    '到期', '过期', '流量', '备用', '邮箱', '客服', '联系', '工单', '倒卖', '防止',
    '节点', '代理', '梯子', 'tg', '发布', '重置', '测试'
  ];
  const blackListRegex = new RegExp(filterKeywords.join('|'));

  const originalProxies = config.proxies || [];

  const filteredProxies = originalProxies.filter(proxy => {
    if (blackListRegex.test(proxy.name)) return false;

    const ratioMatch = proxy.name.match(ratioRegex);
    if (ratioMatch) {
      const ratio = parseFloat(ratioMatch[1] || ratioMatch[2] || ratioMatch[3]);
      if (ratio > maxRatio) return false;
    }
    return true;
  });

  if (filteredProxies.length === 0 && originalProxies.length === 0) return config;

  const REGIONS = [
    { name: "美国节点", pattern: "美|纽约|波特兰|达拉斯|俄勒冈|凤凰城|费利蒙|硅谷|拉斯维加斯|洛杉矶|圣何塞|圣克拉拉|西雅图|芝加哥|US|United States|SJC", icon: "United_States.png" },
    { name: "日本节点", pattern: "日本|东京|大阪|JP|Japan", icon: "Japan.png" },
    { name: "狮城节点", pattern: "新加坡|狮城|SG|Singapore|SIN", icon: "Singapore.png" },
    { name: "香港节点", pattern: "港|HK|Hong Kong", icon: "Hong_Kong.png" },
    { name: "台湾节点", pattern: "台|新北|彰化|TW|Taiwan", icon: "Taiwan.png" }
  ];

  const validRegions = [];

  for (const region of REGIONS) {
    const regex = new RegExp(region.pattern);
    if (filteredProxies.some(proxy => regex.test(proxy.name))) {
      validRegions.push(region);
    }
  }

  const validRegionNames = validRegions.map(r => r.name);

  const proxyGroups = [];

  proxyGroups.push({
    name: "节点选择",
    icon: `${ICON_BASE}Proxy.png`,
    type: "select",
    proxies: [...validRegionNames, "手动切换"]
  });

  for (const region of validRegions) {
    const regex = new RegExp(region.pattern);
    const regionProxies = filteredProxies
      .filter(proxy => regex.test(proxy.name))
      .map(proxy => proxy.name);

    if (regionProxies.length > 0) {
      proxyGroups.push({
        name: region.name,
        icon: `${ICON_BASE}${region.icon}`,
        type: "url-test",
        proxies: regionProxies,
        interval: 300,
        tolerance: 50
      });
    }
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
    proxies: ["节点选择", ...validRegionNames, "手动切换", "DIRECT"]
  });

  config["proxy-groups"] = proxyGroups;

  config["rule-providers"] = {
    LocalAreaNetwork: { url: `${RULE_BASE}LocalAreaNetwork.list`, path: "./ruleset/LocalAreaNetwork.list", behavior: "classical", interval: 86400, format: "text", type: "http" },
    UnBan: { url: `${RULE_BASE}UnBan.list`, path: "./ruleset/UnBan.list", behavior: "classical", interval: 86400, format: "text", type: "http" },
    BanAD: { url: `${RULE_BASE}BanAD.list`, path: "./ruleset/BanAD.list", behavior: "classical", interval: 86400, format: "text", type: "http" },
    BanProgramAD: { url: `${RULE_BASE}BanProgramAD.list`, path: "./ruleset/BanProgramAD.list", behavior: "classical", interval: 86400, format: "text", type: "http" },
    ProxyGFWlist: { url: `${RULE_BASE}ProxyGFWlist.list`, path: "./ruleset/ProxyGFWlist.list", behavior: "classical", interval: 86400, format: "text", type: "http" },
    ChinaDomain: { url: `${RULE_BASE}ChinaDomain.list`, path: "./ruleset/ChinaDomain.list", behavior: "domain", interval: 86400, format: "text", type: "http" }
  };

  config["rules"] = [
    "RULE-SET,LocalAreaNetwork,DIRECT",
    "RULE-SET,UnBan,DIRECT",
    "RULE-SET,BanAD,REJECT",
    "RULE-SET,BanProgramAD,REJECT",
    "RULE-SET,ProxyGFWlist,节点选择",
    "RULE-SET,ChinaDomain,DIRECT",
    "GEOIP,CN,DIRECT",
    "MATCH,节点选择"
  ];

  config.proxies = originalProxies;
  return config;
}
