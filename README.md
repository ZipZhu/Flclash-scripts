# Flclash-scripts
A repository for Flclash scripts.

脚本为Flclash（https://github.com/chen08209/FlClash
）制作，或许也适用于clash verge rev（https://github.com/clash-verge-rev/clash-verge-rev
）。后者未进行测试，不保证可用和稳定性。）。后者未进行测试，不保证可用和稳定性。

scripts1：分流细致，分组很多，功能较为丰富。具体介绍：https://linux.do/t/topic/995297

scripts2：仅分组，移除了scripts1中的大多数分流规则，仅保留了对广告屏蔽规则，策略组数量大大减少。同时对订阅源节点不固定场景进行了优化，动态生成节点组。具体介绍：https://linux.do/t/topic/1010793

scripts3：在scripts2的基础上进一步简化，并引入了节点过滤。具体介绍：https://linux.do/t/topic/1063863

scripts4：仅图标资源使用的CDN域名与scripts3不同，scripts3为testingcf.jsdelivr.net，脚本4为cdn.jsdelivr.net，大多数场景下对图片资源的加载更流畅。

scripts5：虽然之前的scripts在正则表达式中使用了 i 标志，但在某些情况下仍然可能出现大小写匹配问题。尝试过的解决方案是在进行正则匹配前，将节点名称统一转换为小写，但并未成功。因此，在scripts4的基础上进行优化，移除了大小写匹配，而是直接穷举了所有大小写可能。（方法笨，但胜在稳定有效）
