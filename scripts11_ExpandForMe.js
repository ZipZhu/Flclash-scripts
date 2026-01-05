function main(config) {
  try {
    // 配置参数
    const maxRatio = 3.0;
    const ratioRegex = /(?:\[(\d+(?:\.\d+)?)\s*(?:x|X|×)\]|(\d+(?:\.\d+)?)\s*(?:x|X|×|倍)|(?:x|X|×|倍)\s*(\d+(?:\.\d+)?))/i;
    
    // 节点过滤关键词
    const filterKeywords = [
      '群', '邀请', '返利', '官网', '官方', '网址', '订阅', '购买', '续费', '剩余',
      '到期', '过期', '流量', '备用', '邮箱', '客服', '联系', '工单', '倒卖', '防止',
      '节点', '代理', '梯子', 'tg', '发布', '重置', '测试'
    ];
    
    // 地区分组配置 - 按使用频率和重要性排序
    const REGIONS = [
      { name: "香港节点", pattern: "香港|港|HK|Hong Kong|HKG", icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Hong_Kong.png" },
      { name: "台湾节点", pattern: "台湾|台北|台|新北|彰化|TW|Taiwan|TPE", icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Taiwan.png" },
      { name: "日本节点", pattern: "日本|东京|大阪|埼玉|JP|Japan|TYO", icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Japan.png" },
      { name: "韩国节点", pattern: "韩国|首尔|韩|KR|Korea|Seoul", icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/South_Korea.png" },
      { name: "新加坡节点", pattern: "新加坡|狮城|SG|Singapore|SIN", icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Singapore.png" },
      { name: "美国节点", pattern: "美|纽约|洛杉矶|芝加哥|达拉斯|西雅图|硅谷|波特兰|俄勒冈|凤凰城|费利蒙|圣克拉拉|圣何塞|拉斯维加斯|迈阿密|亚特兰大|芝加哥|US|USA|United States|America|SJC|LAX|ORD", icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/United_States.png" },
      { name: "英国节点", pattern: "英国|伦敦|英|UK|GB|Great Britain|United Kingdom|LHR", icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/United_Kingdom.png" },
      { name: "德国节点", pattern: "德国|法兰克福|德|DE|Germany|FRA", icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Germany.png" },
      { name: "澳大利亚节点", pattern: "澳大利亚|澳洲|悉尼|墨尔本|AU|Australia|SYD", icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Australia.png" },
      { name: "加拿大节点", pattern: "加拿大|蒙特利尔|多伦多|CA|Canada|YUL|YYZ", icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Canada.png" },
      { name: "其他亚洲", pattern: "亚洲|印度|印尼|泰国|越南|菲律宾|马来西亚|印度尼西亚|IN|ID|TH|VN|PH|MY|Asia", icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Asia.png" },
      { name: "其他欧洲", pattern: "欧洲|法国|巴黎|荷兰|阿姆斯特丹|瑞士|瑞典|芬兰|挪威|丹麦|FR|NL|CH|SE|FI|NO|DK|EU|Europe", icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Europe.png" },
      { name: "其他美洲", pattern: "美洲|巴西|墨西哥|阿根廷|智利|BR|MX|AR|CL|SA|South America|Latin America", icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Americas.png" },
      { name: "其他地区", pattern: ".*", fallback: true, icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Global.png" }
    ];

    // 防御性检查 - 确保配置对象存在
    if (!config) {
      console.warn("配置对象不存在，创建新配置");
      config = {};
    }

    // 获取原始代理列表，确保默认值
    const originalProxies = config.proxies || [];
    
    if (!Array.isArray(originalProxies)) {
      console.warn("配置中的proxies不是数组，重置为空数组");
      config.proxies = [];
      return config;
    }

    // 创建过滤正则表达式
    let blackListRegex;
    try {
      blackListRegex = new RegExp(filterKeywords.join('|'), 'i');
    } catch (e) {
      console.error("创建黑名单正则表达式失败:", e);
      blackListRegex = /群|邀请|返利/i; // 使用简化版本
    }

    // 安全地过滤代理
    let filteredProxies = [];
    try {
      filteredProxies = originalProxies.filter(proxy => {
        if (!proxy || !proxy.name) return false;
        
        // 检查黑名单关键词
        if (blackListRegex.test(proxy.name)) return false;
        
        // 检查倍率限制
        try {
          const ratioMatch = proxy.name.match(ratioRegex);
          if (ratioMatch) {
            const ratioStr = ratioMatch[1] || ratioMatch[2] || ratioMatch[3];
            if (ratioStr) {
              const ratio = parseFloat(ratioStr);
              if (!isNaN(ratio) && ratio > maxRatio) return false;
            }
          }
        } catch (e) {
          console.warn(`处理代理 "${proxy.name}" 时出错:`, e);
        }
        
        return true;
      });
    } catch (e) {
      console.error("过滤代理时出错:", e);
      filteredProxies = [...originalProxies]; // 出错时使用原始列表
    }

    // 如果没有可用代理，保留原始配置
    if (filteredProxies.length === 0) {
      if (originalProxies.length > 0) {
        console.warn("所有代理都被过滤，可能存在配置问题，保留原始代理列表");
        filteredProxies = [...originalProxies];
      } else {
        console.warn("没有可用代理，跳过代理组配置");
        return config;
      }
    }

    // 创建地区分组
    const regionGroups = new Map();
    
    // 将代理分配到对应地区
    filteredProxies.forEach(proxy => {
      if (!proxy || !proxy.name) return;
      
      let matched = false;
      
      // 检查预定义地区
      for (const region of REGIONS) {
        if (region.fallback) continue; // 跳过兜底项
        
        try {
          const regex = new RegExp(region.pattern, 'i');
          if (regex.test(proxy.name)) {
            if (!regionGroups.has(region.name)) {
              regionGroups.set(region.name, {
                icon: region.icon,
                proxies: []
              });
            }
            regionGroups.get(region.name).proxies.push(proxy.name);
            matched = true;
            break;
          }
        } catch (e) {
          console.warn(`地区 "${region.name}" 的正则表达式匹配出错:`, e);
        }
      }
      
      // 未匹配任何地区，归入"其他地区"
      if (!matched) {
        const fallbackRegion = REGIONS.find(r => r.fallback);
        if (fallbackRegion) {
          if (!regionGroups.has(fallbackRegion.name)) {
            regionGroups.set(fallbackRegion.name, {
              icon: fallbackRegion.icon,
              proxies: []
            });
          }
          regionGroups.get(fallbackRegion.name).proxies.push(proxy.name);
        }
      }
    });

    // 创建有效的地区列表
    const validRegions = [];
    for (const [name, data] of regionGroups.entries()) {
      if (data.proxies.length > 0) {
        validRegions.push({
          name,
          icon: data.icon,
          proxies: data.proxies
        });
      }
    }

    // 如果没有有效地区，创建基本配置
    if (validRegions.length === 0) {
      console.warn("没有找到有效地区分组，创建基本代理组");
      
      config["proxy-groups"] = [{
        name: "节点选择",
        icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Proxy.png",
        type: "select",
        proxies: ["DIRECT"]
      }];
      
      config.proxies = originalProxies;
      return config;
    }

    // 创建代理组
    const proxyGroups = [];
    
    // 节点选择组
    proxyGroups.push({
      name: "节点选择",
      icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Proxy.png",
      type: "select",
      proxies: validRegions.map(r => r.name)
    });

    // 为每个有效地区创建URL-test组
    for (const region of validRegions) {
      if (region.proxies.length > 0) {
        proxyGroups.push({
          name: region.name,
          icon: region.icon,
          type: "url-test",
          url: "http://www.gstatic.com/generate_204",
          interval: 300,
          tolerance: 50,
          proxies: region.proxies
        });
      }
    }

    // 全球组
    proxyGroups.push({
      name: "GLOBAL",
      icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Global.png",
      type: "select",
      proxies: ["节点选择", ...validRegions.map(r => r.name), "DIRECT"]
    });

    // 更新配置
    config["proxy-groups"] = proxyGroups;

    // 规则提供者 - 使用try-catch确保单个规则失败不影响整体
    try {
      config["rule-providers"] = {
        reject: { url: "https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/reject.txt", path: "./ruleset/reject.yaml", behavior: "domain", interval: 86400, format: "yaml", type: "http" },
        proxy: { url: "https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/proxy.txt", path: "./ruleset/proxy.yaml", behavior: "domain", interval: 86400, format: "yaml", type: "http" },
        direct: { url: "https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/direct.txt", path: "./ruleset/direct.yaml", behavior: "domain", interval: 86400, format: "yaml", type: "http" },
        private: { url: "https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/private.txt", path: "./ruleset/private.yaml", behavior: "domain", interval: 86400, format: "yaml", type: "http" },
        gfw: { url: "https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/gfw.txt", path: "./ruleset/gfw.yaml", behavior: "domain", interval: 86400, format: "yaml", type: "http" },
        greatfire: { url: "https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/greatfire.txt", path: "./ruleset/greatfire.yaml", behavior: "domain", interval: 86400, format: "yaml", type: "http" },
        tld_not_cn: { url: "https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/tld-not-cn.txt", path: "./ruleset/tld-not-cn.yaml", behavior: "domain", interval: 86400, format: "yaml", type: "http" },
        cncidr: { url: "https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/cncidr.txt", path: "./ruleset/cncidr.yaml", behavior: "ipcidr", interval: 86400, format: "yaml", type: "http" }
      };
    } catch (e) {
      console.error("配置规则提供者时出错:", e);
      config["rule-providers"] = {};
    }

    // 规则配置
    try {
      config["rules"] = [
        "RULE-SET,private,DIRECT",
        "RULE-SET,reject,REJECT",
        "RULE-SET,proxy,节点选择",
        "RULE-SET,gfw,节点选择",
        "RULE-SET,greatfire,节点选择",
        "RULE-SET,tld_not_cn,节点选择",
        "RULE-SET,direct,DIRECT",
        "GEOIP,CN,DIRECT",
        "MATCH,节点选择"
      ];
    } catch (e) {
      console.error("配置规则时出错:", e);
      config["rules"] = ["MATCH,节点选择"];
    }

    // 保留原始代理
    config.proxies = originalProxies;
    
    return config;
  } catch (e) {
    console.error("处理配置时发生严重错误:", e);
    
    // 尝试返回基本可用的配置
    if (!config) config = {};
    
    // 确保至少有基本代理组
    if (!config["proxy-groups"]) {
      config["proxy-groups"] = [{
        name: "节点选择",
        type: "select",
        proxies: ["DIRECT"]
      }];
    }
    
    return config;
  }
}