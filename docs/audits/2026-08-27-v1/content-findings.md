# V1 Content Source Audit

Audit revision: `48f5cff867a65fbfef0a7fffe0cab87726e85069` on `audit/v1-quality-round-1`. Access date for every web source: `2026-08-27`.

## Method and scope

- Audited all claims currently published for the eight scientists, the six timeline events, six spirit themes and every relationship, four activities, three media records, three archive records, and six source-registry records.
- Used Shanghai University, the Chinese Academy of Sciences, the Chinese Academy of Engineering, Tsinghua University, Fudan University, the Ministry of Science and Technology, and other university/government pages as direct evidence. Search summaries, encyclopedias, self-media, and copied aggregators were not accepted as evidence.
- `Verified` means the cited direct source matches the website. `Correction` means direct evidence requires the exact replacement shown. `Insufficient` means the claim should be retained only in the narrowed form shown or removed until evidence is supplied. `Conflict` means authoritative sources disagree; the proposed text avoids silently choosing one.
- The three source-library PowerPoint files named in `src/content/sources.ts` were not present in the accessible project/source roots, so their slide locators and image captions could not be independently inspected. Those rows are explicitly classified as repository registry only, not externally verified.

## Findings

| ID | Entity/page | Current claim | Verdict | Proposed text | Source URL | Source type | Accessed | Confidence |
|---|---|---|---|---|---|---|---|---|
| CF-001 | 钱伟长 / 人物卡、人物专题 | 姓名钱伟长；科学家、教育家，上海大学首任校长；应用数学、力学、教育 | Verified | 保留现文。 | https://www.cas.cn/xzfc/202108/t20210818_4802285.shtml<br>https://www.tsinghua.edu.cn/info/1182/98259.htm | 中国科学院；清华大学 | 2026-08-27 | High |
| CF-002 | 钱伟长 / 人物卡、人物专题 | `1912—2010` | Conflict | 暂保留“1912—2010”，并在来源说明中记录：中科院、清华大学为1912年生，上海大学档案馆页面为1913年生；请档案馆复核后再统一。 | https://www.cas.cn/xzfc/202108/t20210818_4802285.shtml<br>https://www.tsinghua.edu.cn/info/1182/98259.htm<br>https://dangan.shu.edu.cn/info/1042/20806.htm | 中国科学院；清华大学；上海大学档案馆 | 2026-08-27 | High (conflict confirmed) |
| CF-003 | 钱伟长 / “板壳非线性内禀统一理论”章节 | 1941年与导师用50天完成《弹性板壳的内禀理论》；方程组被称为“钱伟长方程” | Verified | 保留现文。 | https://www.cas.cn/xzfc/202108/t20210818_4802285.shtml | 中国科学院 | 2026-08-27 | High |
| CF-004 | 钱伟长 / “圆薄板大挠度摄动解”章节 | 1947年以中心挠度为摄动参数导出“钱伟长方法” | Verified | 保留现文。 | https://www.cas.cn/xzfc/202108/t20210818_4802285.shtml | 中国科学院 | 2026-08-27 | High |
| CF-005 | 钱伟长 / “圆薄板大挠度摄动解”章节 | 相关工作于1955年获中国科学院国家科学奖二等奖 | Conflict | 改为“相关工作获中国科学院国家科学奖二等奖。”暂不写年份；上海大学档案馆记1955年，中科院和清华大学记1956年。 | https://dangan.shu.edu.cn/info/1042/20806.htm<br>https://www.cas.cn/xzfc/202108/t20210818_4802285.shtml<br>https://www.tsinghua.edu.cn/info/1182/98259.htm | 上海大学档案馆；中国科学院；清华大学 | 2026-08-27 | High (conflict confirmed) |
| CF-006 | 钱伟长 / “航空航天与奇异摄动研究”章节 | 1942年底起在加州理工学院喷射推进研究所参与火箭和导弹实验，并发表第一篇奇异摄动理论论文 | Verified | 保留现文。 | https://www.cas.cn/xzfc/202108/t20210818_4802285.shtml | 中国科学院 | 2026-08-27 | High |
| CF-007 | 钱伟长 / 时间线“1946年5月” | 从洛杉矶乘船回国，随后回到清华大学任教 | Insufficient | 收窄为“1946年5月，钱伟长回国，随后任清华大学教授。”删除未获直接来源支持的“从洛杉矶乘船”；若坚持保留航程，应补原始行程材料。 | https://www.tsinghua.org.cn/info/1014/9997.htm<br>https://www.cas.cn/xzfc/202108/t20210818_4802285.shtml | 清华校友总会；中国科学院 | 2026-08-27 | Medium |
| CF-008 | 钱伟长 / 故事与精神关系 | 从文史转向物理；关联爱国、求实和育人 | Verified | 保留人物转向及爱国、求实、育人关系；主题名称按CF-041统一。 | https://www.cas.cn/xzfc/202108/t20210818_4802285.shtml<br>https://www.tsinghua.edu.cn/info/1182/98259.htm | 中国科学院；清华大学 | 2026-08-27 | High |
| CF-009 | 钱伟长 / 肖像与2026宣讲课件档案 | `slide 2`肖像、`slide 1`封面及课件内容说明 | Insufficient | 保留为“项目课件来源登记，原件待团队复核”；在原PPT可访问前，不宣称已独立核对具体幻灯片、图片身份或课件完整内容。 | https://github.com/GauntWheelCake/shu-scientist-museum/blob/9da9b58786d74f454ce7a8a20ee9631a7d379e5d/src/content/sources.ts | 仓库来源登记（原件不可访问） | 2026-08-27 | Low |
| CF-010 | 李三立 / 人物卡、人物专题 | `2022年逝世` | Correction | 改为“1935—2022”。 | https://www.cae.cn/cae/html/main/colys/53878278.html<br>https://news.shu.edu.cn/info/1021/64368.htm | 中国工程院；上海大学 | 2026-08-27 | High |
| CF-011 | 李三立 / 人物卡、人物专题 | 中国工程院院士，高性能计算领域先驱；计算机体系结构、高性能计算、网格技术 | Verified | 保留现文。 | https://www.cae.cn/cae/html/main/colys/53878278.html<br>https://news.shu.edu.cn/info/1021/64368.htm | 中国工程院；上海大学 | 2026-08-27 | High |
| CF-012 | 李三立 / 911机章节与1964年3月时间线 | 插件无档案、控制信号不稳、两百多处虚焊；1964年3月研制成功并投入运行 | Insufficient | 在取得可复核原始材料前，删除该章节和时间线节点，或统一改为“911电子管计算机相关资料待核验”；不得继续标作“已核实时间节点”。 | https://www.cae.cn/cae/html/main/colys/53878278.html<br>https://news.shu.edu.cn/info/1021/64368.htm | 中国工程院；上海大学（所列直接页面未包含这些细节） | 2026-08-27 | Low |
| CF-013 | 李三立 / 724机章节 | 火箭基地需求、数百块印刷板与模块、全机调试；完成国防任务并成为高校大型计算机 | Insufficient | 收窄为“李三立曾负责研制724机；中国工程院记载，724机是20世纪70年代我国各大学中用于国家尖端科技规模最大的计算机。”删除未获直接来源支持的基地、板卡数量和具体调试叙述。 | https://www.cae.cn/cae/html/main/colys/53878278.html<br>https://news.shu.edu.cn/info/1021/64368.htm | 中国工程院；上海大学 | 2026-08-27 | High for narrowed text |
| CF-014 | 李三立 / “自强”章节与2004时间线 | 带领团队研制自强2000、自强3000并建设网格平台；自强3000于2004年列TOP500第126位 | Verified | 保留现文。 | https://news.shu.edu.cn/info/1021/64368.htm<br>https://www.cae.cn/cae/html/main/colys/53878278.html | 上海大学；中国工程院 | 2026-08-27 | High |
| CF-015 | 1994年 / 上海大学时间线 | 新上海大学合并组建；钱伟长任首任校长；李三立此后长期任计算机学院院长 | Verified | 保留；可将“长期”精确为“1994年至2015年”。 | https://www.tsinghua.edu.cn/info/1182/98259.htm<br>https://news.shu.edu.cn/info/1021/64368.htm | 清华大学；上海大学 | 2026-08-27 | High |
| CF-016 | 李三立 / 故事“为祖国造超级大脑” | 从排查虚焊到建设高性能计算平台，见证中国计算机从无到有 | Insufficient | 收窄为“从研制724机到建设‘自强’高性能计算平台，持续推动我国计算机事业发展。”删除依赖CF-012未核细节及“从无到有”的过宽概括。 | https://www.cae.cn/cae/html/main/colys/53878278.html<br>https://news.shu.edu.cn/info/1021/64368.htm | 中国工程院；上海大学 | 2026-08-27 | High for narrowed text |
| CF-017 | 李三立 / 肖像与2026宣讲课件档案 | `slide 2`肖像、`slide 1`封面；课件围绕911、724和“自强”系列 | Insufficient | 保留为“项目课件来源登记，原件待团队复核”；911相关档案说明同时受CF-012约束。 | https://github.com/GauntWheelCake/shu-scientist-museum/blob/9da9b58786d74f454ce7a8a20ee9631a7d379e5d/src/content/sources.ts | 仓库来源登记（原件不可访问） | 2026-08-27 | Low |
| CF-018 | 黄宏嘉 / 人物卡、人物专题 | `1924年生` | Correction | 改为“1924—2021”。 | https://www.cas.cn/zt/rwzt/2022qm/hhj/202204/t20220401_4830310.shtml | 中国科学院 | 2026-08-27 | High |
| CF-019 | 黄宏嘉 / 人物卡、人物专题 | 中国科学院院士，微波与光波导学家；微波技术、光波导、光纤通信 | Verified | 保留现文。 | https://scie.shu.edu.cn/Prof/huanghj.htm<br>https://www.cas.cn/zt/rwzt/2022qm/hhj/202204/t20220401_4830310.shtml | 上海大学；中国科学院 | 2026-08-27 | High |
| CF-020 | 黄宏嘉 / 《微波原理》章节与时间线 | 约百万字，1964年由科学出版社出版；国内第一本专著、“为中国人争气的书” | Conflict | 改为“20世纪60年代，约百万字的《微波原理》由科学出版社出版，成为国内该领域第一本专著，被国际学界称为一本‘为中国人争气的书’。”暂不写具体年份；中科院记1964，上海大学成果页记1963。 | https://www.cas.cn/zt/rwzt/2022qm/hhj/202204/t20220401_4830310.shtml<br>https://www.shu.edu.cn/info/1667/270302.htm | 中国科学院；上海大学 | 2026-08-27 | High (conflict confirmed) |
| CF-021 | 黄宏嘉 / “从微波走向光波导”章节 | 发表《从微波到光》；创立“超模式”；为国内光纤通信研究提供理论基础 | Verified | 保留现文。 | https://www.cas.cn/zt/rwzt/2022qm/hhj/202204/t20220401_4830310.shtml<br>https://scie.shu.edu.cn/Prof/huanghj.htm | 中国科学院；上海大学 | 2026-08-27 | High |
| CF-022 | 黄宏嘉 / 国产单模光纤章节 | 创建波科学研究实验室；曾在家中煤气灶上拉制光纤雏形；团队于1980年前后研制中国单模光纤 | Insufficient | 收窄为“1979年，他在上海科学技术大学创建波科学研究实验室；此后带领团队并与上海石英厂等单位合作开展单模光纤研究，研制出我国第一根单模光纤。”删除“家中煤气灶”细节，除非补充可复核直接来源。 | https://www.cas.cn/zt/rwzt/2022qm/hhj/202204/t20220401_4830310.shtml | 中国科学院 | 2026-08-27 | High for narrowed text |
| CF-023 | 黄宏嘉 / “黄氏波片”章节 | 提出用于调控偏振状态的“黄氏波片”，获国际同行认可 | Insufficient | 在取得论文、专利或上海大学/中科院直接记录前删除该章节，或改为“特种光纤相关成果资料待核验”。 | https://scie.shu.edu.cn/Prof/huanghj.htm<br>https://www.shu.edu.cn/info/1667/270302.htm | 上海大学（所列直接页面未出现“黄氏波片”） | 2026-08-27 | Low |
| CF-024 | 黄宏嘉 / 1980年前后时间线与故事 | 国产单模光纤研制取得进展；从微波理论走向单模光纤和通信实践 | Verified | 保留该保守时间表述与故事概括。 | https://www.cas.cn/zt/rwzt/2022qm/hhj/202204/t20220401_4830310.shtml | 中国科学院 | 2026-08-27 | High |
| CF-025 | 黄宏嘉 / 实验室照片与2026宣讲课件档案 | `slide 3`实验室照片、`slide 1`封面及课件说明 | Insufficient | 保留为“项目课件来源登记，原件待团队复核”；在原PPT可访问前，不宣称已独立核对人物、场景或幻灯片定位。 | https://github.com/GauntWheelCake/shu-scientist-museum/blob/9da9b58786d74f454ce7a8a20ee9631a7d379e5d/src/content/sources.ts | 仓库来源登记（原件不可访问） | 2026-08-27 | Low |
| CF-026 | 孙晋良 / 人物卡、人物专题 | 生年为空 | Correction | 补为“1946年生”。 | https://www.shu.edu.cn/info/1279/50973.htm | 上海大学 | 2026-08-27 | High |
| CF-027 | 孙晋良 / 人物卡、人物专题 | 中国工程院院士，复合材料专家；碳/碳复合材料、特种纤维、产业用纺织材料 | Verified | 保留身份和领域；“产业用纺织材料”建议与来源术语统一为“特种纺织材料”。 | https://www.shu.edu.cn/info/1279/50973.htm<br>https://www.shu.edu.cn/ljrw/lyys.htm | 上海大学 | 2026-08-27 | High |
| CF-028 | 孙晋良 / 人物摘要 | 推动关键材料自主可控 | Correction | 改为“长期从事碳/碳复合材料、特种纤维及特种纺织材料研究，相关成果应用于劳动防护、航空、航天等领域。” | https://www.shu.edu.cn/info/1279/50973.htm<br>https://ictst.dhu.edu.cn/2018/0530/c12891a196439/page.htm | 上海大学；东华大学 | 2026-08-27 | High |
| CF-029 | 孙晋良 / 图谱精神关系 | 胸怀祖国、勇于创新、协同攻坚 | Insufficient | 在增加可核实人物事迹前，仅保留“创新”关系；“爱国”“协同”关系应补具体行动依据或暂时移除。 | https://www.shu.edu.cn/info/1279/50973.htm | 上海大学 | 2026-08-27 | Medium |
| CF-030 | 周邦新 / 人物卡、人物专题 | 1935年生；中国工程院院士，核材料与核燃料元件专家；锆合金、镍基合金、压力壳钢和核燃料元件 | Verified | 保留现文。 | https://mat.shu.edu.cn/info/1012/4673.htm<br>https://alumni.ustb.edu.cn/bkyj/dsfc/861bef410da64b758b0888d1d80d57de.htm | 上海大学；北京科技大学校友会 | 2026-08-27 | High |
| CF-031 | 周邦新 / 图谱精神关系 | 胸怀祖国、求真务实、甘于奉献 | Verified | 保留关系；主题名称按CF-041统一。 | https://alumni.ustb.edu.cn/bkyj/dsfc/861bef410da64b758b0888d1d80d57de.htm | 北京科技大学校友会 | 2026-08-27 | Medium-High |
| CF-032 | 杨雄里 / 人物卡、人物专题 | `1935年生` | Correction | 改为“1941年生”。 | https://iobs.fudan.edu.cn/2f/84/c49983a733060/page.htm | 复旦大学脑科学研究院 | 2026-08-27 | High |
| CF-033 | 杨雄里 / 人物卡、人物专题 | 中国科学院院士，神经生物学家；视觉神经机制；参与推动中国脑科学计划 | Verified | 保留；“参与推动”可精确为“中国‘脑计划’主要倡议人之一”。 | https://iobs.fudan.edu.cn/2f/84/c49983a733060/page.htm<br>https://ad.cas.cn/mtbd2022/202303/t20230302_4877219.html | 复旦大学；中国科学院 | 2026-08-27 | High |
| CF-034 | 杨雄里 / 图谱精神关系 | 勇于创新、求真务实、育人传承 | Insufficient | 保留“创新、求实”；“育人”关系需补直接教学、培养后学或团队传承材料，否则暂时移除。 | https://iobs.fudan.edu.cn/2f/84/c49983a733060/page.htm | 复旦大学脑科学研究院 | 2026-08-27 | Medium |
| CF-035 | 谢少荣 / 人物卡、人物专题 | 上海大学教授，海洋智能无人艇研究者；“精海”系列与无人艇集群研究 | Verified | 保留身份、领域和集群研究概括。 | https://www.shu.edu.cn/info/1055/323495.htm<br>https://www.shu.edu.cn/info/1056/350475.htm | 上海大学 | 2026-08-27 | High |
| CF-036 | 谢少荣 / 人物摘要 | 形成“精海”系列产品 | Correction | 改为“带领团队深耕海洋智能无人艇，研制‘精海’系列无人艇并开展无人艇集群研究。” | https://www.shu.edu.cn/info/1055/323495.htm<br>https://www.shu.edu.cn/info/1056/350475.htm | 上海大学 | 2026-08-27 | High |
| CF-037 | 谢少荣 / 图谱精神关系 | 胸怀祖国、勇于创新、协同攻坚 | Verified | 保留关系；主题名称按CF-041统一。 | https://stcsm.sh.gov.cn/xwzx/kjzl/20211012/8a3589228bf84c2c87f05e9a8349198a.html<br>https://www.shu.edu.cn/info/1055/323495.htm | 上海市科学技术委员会；上海大学 | 2026-08-27 | Medium-High |
| CF-038 | 岳晓冬 / 人物卡、人物专题 | 上海大学教授，人工智能与机器学习研究者 | Verified | 保留现文。 | https://ai.shu.edu.cn/info/1073/1557.htm | 上海大学未来技术学院 | 2026-08-27 | High |
| CF-039 | 岳晓冬 / 人物摘要与领域 | 从机器学习理论走向产学研融合；多模态识别、迁移学习和真实场景应用 | Insufficient | 收窄为“从事人工智能理论与应用研究，研究方向为机器学习、软计算与决策支持系统。”领域改为“机器学习、软计算、决策支持系统”；若保留“多模态识别、迁移学习”，须补直接项目或论文记录。 | https://ai.shu.edu.cn/info/1073/1557.htm | 上海大学未来技术学院 | 2026-08-27 | High for narrowed text |
| CF-040 | 岳晓冬 / 图谱精神关系 | 勇于创新、求真务实、育人传承 | Insufficient | 保留“创新、求实”；“育人”关系可在补充“我心目中的好导师”等直接事迹材料后保留，否则暂时移除。 | https://ai.shu.edu.cn/info/1073/1557.htm | 上海大学未来技术学院 | 2026-08-27 | Medium |
| CF-041 | 精神谱系 / 首页、精神页、图谱、筛选 | 六个标题为“胸怀祖国、勇于创新、求真务实、甘于奉献、协同攻坚、育人传承” | Correction | 依次改为“胸怀祖国、服务人民”“勇攀高峰、敢为人先”“追求真理、严谨治学”“淡泊名利、潜心研究”“集智攻关、团结协作”“甘为人梯、奖掖后学”；稳定ID不变。 | https://www.most.gov.cn/xxgk/xinxifenlei/fdzdgknr/fgzc/gfxwj/gfxwj2019/201906/t20190612_147045.html | 科技部转载中共中央办公厅、国务院办公厅文件 | 2026-08-27 | High |
| CF-042 | 精神谱系 / 六项摘要与关键词 | 六项摘要分别解释爱国、创新、求实、奉献、协同、育人 | Verified | 语义与正式六项内涵一致，可保留；关键词随CF-041规范标题作小幅术语统一。 | https://www.most.gov.cn/xxgk/xinxifenlei/fdzdgknr/fgzc/gfxwj/gfxwj2019/201906/t20190612_147045.html | 科技部转载中共中央办公厅、国务院办公厅文件 | 2026-08-27 | High |
| CF-043 | 支部实践 / 精神足迹 | `2026年7月（计划）`；上海大学宝山校区；计划开展微党课、微团课 | Insufficient | 改为“时间待重新确认（原计划2026年7月）”；地点改为“计划地点：上海大学宝山校区”；描述改用“原计划”，状态继续为`planned`，直至团队提供完成材料。 | https://github.com/GauntWheelCake/shu-scientist-museum/blob/9da9b58786d74f454ce7a8a20ee9631a7d379e5d/src/content/activities.ts | 仓库计划记录（无完成证据） | 2026-08-27 | Medium |
| CF-044 | 校园实践 / 精神足迹 | `2026年7月（计划）`；上海大学附属小学等学校 | Insufficient | 改为“时间待重新确认（原计划2026年7月）”；地点改为“计划地点：上海大学附属小学等学校”；描述改用“原计划”，状态继续为`planned`。 | https://github.com/GauntWheelCake/shu-scientist-museum/blob/9da9b58786d74f454ce7a8a20ee9631a7d379e5d/src/content/activities.ts | 仓库计划记录（无完成证据） | 2026-08-27 | Medium |
| CF-045 | 社区实践 / 精神足迹 | `2026年7月（计划）`；友谊路街道、真如街道 | Insufficient | 改为“时间待重新确认（原计划2026年7月）”；地点前加“计划地点：”；描述改用“原计划”，状态继续为`planned`。 | https://github.com/GauntWheelCake/shu-scientist-museum/blob/9da9b58786d74f454ce7a8a20ee9631a7d379e5d/src/content/activities.ts | 仓库计划记录（无完成证据） | 2026-08-27 | Medium |
| CF-046 | 军营实践 / 精神足迹 | `2026年7月（计划）`；南京路上好八连事迹纪念馆等 | Insufficient | 改为“时间待重新确认（原计划2026年7月）”；地点前加“计划地点：”；描述改用“原计划”，状态继续为`planned`。 | https://github.com/GauntWheelCake/shu-scientist-museum/blob/9da9b58786d74f454ce7a8a20ee9631a7d379e5d/src/content/activities.ts | 仓库计划记录（无完成证据） | 2026-08-27 | Medium |
| CF-047 | 四项实践 / 首页、精神足迹 | 全部`planned`、参与人数0；页面只显示计划，不统计成果 | Verified | 保持`planned`和0，不新增完成场次、人数或成效；页面动作与状态一致。 | https://github.com/GauntWheelCake/shu-scientist-museum/blob/9da9b58786d74f454ce7a8a20ee9631a7d379e5d/src/content/activities.ts | 仓库状态合同 | 2026-08-27 | High |
| CF-048 | 四项实践 / 图片说明与来源 | 四个“计划示意图”路径和`source-practice-plan-*`来源ID；公开文件不存在，来源登记表也无对应记录 | Insufficient | 保留无图降级，不把任何图片当作活动现场；删除未登记的图片`sourceId`/伪图片路径，或在团队提供真实计划视觉及来源后完整登记。 | https://github.com/GauntWheelCake/shu-scientist-museum/blob/9da9b58786d74f454ce7a8a20ee9631a7d379e5d/src/content/activities.ts<br>https://github.com/GauntWheelCake/shu-scientist-museum/blob/9da9b58786d74f454ce7a8a20ee9631a7d379e5d/src/content/sources.ts | 仓库状态与来源登记 | 2026-08-27 | High |
| CF-049 | 三项影音 / 首页、影音档案 | 钱伟长、李三立、黄宏嘉微课影音均为`collecting`；无平台、URL和播放动作 | Verified | 保持`collecting`，不填写平台或URL，不显示播放入口；只有取得发布主体、公开HTTPS地址和授权状态后才改为`published`。 | https://github.com/GauntWheelCake/shu-scientist-museum/blob/9da9b58786d74f454ce7a8a20ee9631a7d379e5d/src/content/media.ts | 仓库状态合同 | 2026-08-27 | High |
| CF-050 | 首页统计 / “已核实展馆数据” | `6个已核实时间节点` | Correction | 在CF-007、CF-012、CF-020解决前改为“6个时间节点”，或仅统计`Verified`事件；不得继续把全部六项统称“已核实”。 | https://github.com/GauntWheelCake/shu-scientist-museum/blob/9da9b58786d74f454ce7a8a20ee9631a7d379e5d/src/pages/Home.tsx | 仓库页面文案；本审计交叉核验 | 2026-08-27 | High |
| CF-051 | 全站 / ID、姓名、关联与状态一致性 | 8个人物、6个事件、6个主题、4个活动、3个媒体的ID和关联；同名字段跨页复用 | Verified | 保持现有稳定ID和引用；事实文本由同一内容模块渲染，未观察到跨页姓名拼写或状态分叉。 | https://github.com/GauntWheelCake/shu-scientist-museum/tree/9da9b58786d74f454ce7a8a20ee9631a7d379e5d/src/content | 仓库内容模型 | 2026-08-27 | High |

## Verdict summary

- Verified: 22
- Correction: 8
- Insufficient: 18
- Conflict: 3
- Total: 51

## Team-supplied evidence still required

1. The three registered PowerPoint originals, so all six `slide` locators, portrait identities, cover captions, and archive descriptions can be inspected directly.
2. A primary or official record for the 911 computer repair narrative and the exact March 1964 event.
3. A paper, patent, institutional biography, or other direct record for “黄氏波片”.
4. Updated activity plan/completion records after the four July 2026 target dates, including actual date, venue, participant count, and real image provenance if any activity occurred.
5. Publishing-platform URLs and authorization evidence before any collecting media item becomes public.

## Reproducible internal checks

```powershell
rg -n "id:|'scientist-|dateLabel:|status:|sourceId:|years:|identity:|summary:|fields:|spiritIds:|title:|description:|action:|significance:" src/content/scientists.ts src/content/events.ts src/content/spirit-themes.ts src/content/activities.ts src/content/media.ts src/content/archives.ts src/content/sources.ts
npm run validate:content
```

The ID/name/date inventory above was used to ensure all eight scientists and every current event, theme, activity, media, archive, and source record appear in the audit. No production content was changed.
