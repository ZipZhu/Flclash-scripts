# Flclash-scripts

脚本专为 **Flclash**制作，或可用于**Clash Verge Rev**，但后者未测试，不保证可用性与稳定性。

---

* **scripts1**：分流细致、分组丰富、功能全面。
  详细介绍：[https://linux.do/t/topic/995297](https://linux.do/t/topic/995297)

* **scripts2**：仅保留分组，移除 scripts1 中大部分分流规则，仅保留广告屏蔽。策略组大幅精简。
  针对订阅源节点不固定场景优化，支持**动态生成节点组**。
  详细介绍：[https://linux.do/t/topic/1010793](https://linux.do/t/topic/1010793)

* **scripts3**：在 scripts2 基础上进一步简化，**引入节点名称过滤**。
  详细介绍：[https://linux.do/t/topic/1063863](https://linux.do/t/topic/1063863)

* **scripts4**：与 scripts3 功能相同，**仅图标 CDN 不同**：

  * scripts3 使用 `testingcf.jsdelivr.net`
  * scripts4 使用 `cdn.jsdelivr.net`（大多数场景下图片加载更流畅）

* **scripts5**：虽然之前的脚本已在正则表达式中使用 `i` 标志，但在部分情况下仍存在大小写匹配异常。
  尝试过在匹配前统一将节点名称转换为小写，但并未成功。 <img src="https://github.com/user-attachments/assets/bc8fcd52-e704-449c-98ae-6a02cf837be2" width="10%" alt="黄豆人流泪抱拳表情：我好没本领" />

  因此，在 scripts4 的基础上进行优化，**移除了大小写匹配标志，改为穷举所有大小写组合**。
  （方法笨，但胜在稳定有效）
  详细介绍：[https://linux.do/t/topic/1092160](https://linux.do/t/topic/1092160)

* **scripts6**：近期出现 **icon 资源加载异常** 问题。
  在 scripts5 的基础上进行了调整：

  * 将 icon 与 rule 从**硬编码 URL**改为**变量拼接**，方便根据网络情况灵活修改上游源。
  * 当前源：

    ```
    const ICON_BASE = "https://cdn.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/";
    const RULE_BASE = "https://cdn.jsdelivr.net/gh/ACL4SSR/ACL4SSR@master/Clash/";
    ```

* **scripts7**：在 scripts6 的基础上进行优化（详细介绍：https://linux.do/t/topic/1251899 ）：
  * 新增“倍率过滤”，当前设置为过滤3倍以上的节点
  * 全量遍历优化为基于 `.some()` 方法的短路检测，避免不必要的计算
  * 调整正则匹配策略，关键词过滤移除了 `i` 标记，改为严格匹配大小写
  * 优化了代码结构与可读性：
    1. 代码严格按照 `常量定义 -> 数据清洗 (Filter) -> 地区探测 (Detect) -> 组装 (Build)` 的顺序排列，符合人类阅读习惯
    2. 将地区定义改为标准的 `REGIONS` 数组对象，直接遍历，去除了所有不必要的中间转换
    3. 移除了 `URL_TEST_DEFAULT` 等利用率低的中间变量

* **scripts8**：在 scripts7 的基础上新增了三个规则提供者：`ChinaIp`  `ChinaMedia` `GoogleCNProxyIP`。优化了一下节点倍率识别。



---

**持续优化中，欢迎反馈使用体验！**
