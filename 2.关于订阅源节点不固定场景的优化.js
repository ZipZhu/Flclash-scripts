function main(config) {
  // 获取所有代理节点
  const allProxies = config.proxies || [];
  
  // 定义地区过滤规则
  const regionFilters = {
    "美国节点": {
      icon: "https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/United_States.png",
      filter: "(?i)美|波特兰|达拉斯|俄勒冈|凤凰城|费利蒙|硅谷|拉斯维加斯|洛杉矶|圣何塞|圣克拉拉|西雅图|芝加哥|US|United States"
    },
    "日本节点": {
      icon: "https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Japan.png",
      filter: "(?i)日本|川日|东京|大阪|泉日|埼玉|沪日|深日|JP|Japan"
    },
    "狮城节点": {
      icon: "https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Singapore.png",
      filter: "(?i)新加坡|坡|狮城|SG|Singapore"
    },
    "香港节点": {
      icon: "https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Hong_Kong.png",
      filter: "(?i)港|HK|hk|Hong Kong|HongKong|hongkong"
    },
    "台湾节点": {
      icon: "https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Taiwan.png",
      filter: "(?i)台|新北|彰化|TW|Taiwan"
    }
  };

  // 检测每个地区是否有节点
  const availableRegions = [];
  const regionProxies = {};
  
  for (const [regionName, regionConfig] of Object.entries(regionFilters)) {
    // 移除(?i)标志，用'i' flag代替
    const pattern = regionConfig.filter.replace(/\(\?i\)/g, "");
    const regex = new RegExp(pattern, "i");
    const matchedProxies = allProxies.filter(proxy => regex.test(proxy.name));
    
    if (matchedProxies.length > 0) {
      availableRegions.push(regionName);
      regionProxies[regionName] = matchedProxies;
    }
  }

  // 构建"其他节点"的排除过滤器
  const excludePattern = Object.values(regionFilters)
    .map(r => r.filter.replace(/\(\?i\)/g, ""))
    .join("|");

  // 检测是否有"其他节点"
  const otherRegex = new RegExp(excludePattern, "i");
  const otherProxies = allProxies.filter(proxy => !otherRegex.test(proxy.name));
  const hasOtherNodes = otherProxies.length > 0;

  // 构建代理组列表
  const proxyGroups = [];
  
  // 构建"节点选择"的代理列表
  const nodeSelectionProxies = [];
  availableRegions.forEach(region => nodeSelectionProxies.push(region));
  if (hasOtherNodes) nodeSelectionProxies.push("其他节点");
  nodeSelectionProxies.push("自动选择", "手动切换", "DIRECT");

  // 节点选择
  proxyGroups.push({
    name: "节点选择",
    icon: "https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Proxy.png",
    type: "select",
    proxies: nodeSelectionProxies
  });

  // 自动选择（自动选择延迟最低的节点）
  proxyGroups.push({
    name: "自动选择",
    icon: "https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Auto.png",
    "include-all": true,
    type: "url-test",
    interval: 300,
    tolerance: 50
  });

  // 手动切换
  proxyGroups.push({
    name: "手动切换",
    icon: "https://testingcf.jsdelivr.net/gh/shindgewongxj/WHATSINStash@master/icon/select.png",
    "include-all": true,
    type: "select"
  });

  // 添加有节点的地区分组
  for (const [regionName, regionConfig] of Object.entries(regionFilters)) {
    if (availableRegions.includes(regionName)) {
      proxyGroups.push({
        name: regionName,
        icon: regionConfig.icon,
        "include-all": true,
        filter: regionConfig.filter,
        type: "url-test",
        interval: 300,
        tolerance: 50
      });
    }
  }

  // 如果有其他节点，添加"其他节点"分组
  if (hasOtherNodes) {
    proxyGroups.push({
      name: "其他节点",
      icon: "https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Global.png",
      "include-all": true,
      "exclude-filter": excludePattern,
      type: "url-test",
      interval: 300,
      tolerance: 50
    });
  }

  // 广告拦截
  proxyGroups.push({
    name: "广告拦截",
    icon: "https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/AdBlack.png",
    type: "select",
    proxies: ["REJECT", "DIRECT"]
  });

  // 应用净化
  proxyGroups.push({
    name: "应用净化",
    icon: "https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Hijacking.png",
    type: "select",
    proxies: ["REJECT", "DIRECT"]
  });

  // 构建"漏网之鱼"的代理列表
  const finalProxies = ["节点选择"];
  availableRegions.forEach(region => finalProxies.push(region));
  if (hasOtherNodes) finalProxies.push("其他节点");
  finalProxies.push("自动选择", "手动切换", "DIRECT");

  // 漏网之鱼
  proxyGroups.push({
    name: "漏网之鱼",
    icon: "https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Final.png",
    type: "select",
    proxies: finalProxies
  });

  // 构建 GLOBAL 的代理列表
  const globalProxies = ["节点选择", "自动选择", "手动切换"];
  availableRegions.forEach(region => globalProxies.push(region));
  if (hasOtherNodes) globalProxies.push("其他节点");
  globalProxies.push("广告拦截", "应用净化", "漏网之鱼");

  // GLOBAL
  proxyGroups.push({
    name: "GLOBAL",
    icon: "https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Global.png",
    "include-all": true,
    type: "select",
    proxies: globalProxies
  });

  config["proxy-groups"] = proxyGroups;

  // 规则提供者配置
  config["rule-providers"] = {
    LocalAreaNetwork: {
      url: "https://testingcf.jsdelivr.net/gh/ACL4SSR/ACL4SSR@master/Clash/LocalAreaNetwork.list",
      path: "./ruleset/LocalAreaNetwork.list",
      behavior: "classical",
      interval: 86400,
      format: "text",
      type: "http"
    },
    UnBan: {
      url: "https://testingcf.jsdelivr.net/gh/ACL4SSR/ACL4SSR@master/Clash/UnBan.list",
      path: "./ruleset/UnBan.list",
      behavior: "classical",
      interval: 86400,
      format: "text",
      type: "http"
    },
    BanAD: {
      url: "https://testingcf.jsdelivr.net/gh/ACL4SSR/ACL4SSR@master/Clash/BanAD.list",
      path: "./ruleset/BanAD.list",
      behavior: "classical",
      interval: 86400,
      format: "text",
      type: "http"
    },
    BanProgramAD: {
      url: "https://testingcf.jsdelivr.net/gh/ACL4SSR/ACL4SSR@master/Clash/BanProgramAD.list",
      path: "./ruleset/BanProgramAD.list",
      behavior: "classical",
      interval: 86400,
      format: "text",
      type: "http"
    },
    ProxyGFWlist: {
      url: "https://testingcf.jsdelivr.net/gh/ACL4SSR/ACL4SSR@master/Clash/ProxyGFWlist.list",
      path: "./ruleset/ProxyGFWlist.list",
      behavior: "classical",
      interval: 86400,
      format: "text",
      type: "http"
    },
    ChinaDomain: {
      url: "https://testingcf.jsdelivr.net/gh/ACL4SSR/ACL4SSR@master/Clash/ChinaDomain.list",
      path: "./ruleset/ChinaDomain.list",
      behavior: "domain",
      interval: 86400,
      format: "text",
      type: "http"
    },
    ChinaCompanyIp: {
      url: "https://testingcf.jsdelivr.net/gh/ACL4SSR/ACL4SSR@master/Clash/ChinaCompanyIp.list",
      path: "./ruleset/ChinaCompanyIp.list",
      behavior: "ipcidr",
      interval: 86400,
      format: "text",
      type: "http"
    },
    Download: {
      url: "https://testingcf.jsdelivr.net/gh/ACL4SSR/ACL4SSR@master/Clash/Download.list",
      path: "./ruleset/Download.list",
      behavior: "classical",
      interval: 86400,
      format: "text",
      type: "http"
    }
  };

  config["rules"] = [
    "RULE-SET,LocalAreaNetwork,DIRECT",
    "RULE-SET,UnBan,DIRECT",
    "RULE-SET,BanAD,广告拦截",
    "RULE-SET,BanProgramAD,应用净化",
    "RULE-SET,ProxyGFWlist,节点选择",
    "RULE-SET,ChinaDomain,DIRECT",
    "RULE-SET,ChinaCompanyIp,DIRECT",
    "RULE-SET,Download,DIRECT",
    "GEOIP,CN,DIRECT",
    "MATCH,漏网之鱼"
  ];

  return config;
}
