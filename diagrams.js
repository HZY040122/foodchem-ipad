/* 机理与过程示意图：节点图（分步高亮）+ 两张交互曲线图 */
(function () {
  const N = (id, x, y, label, c, w) => ({ id, x, y, label, c: c || '', w: w || 200 });
  const G = {
    change: { title: '贮藏加工中的化学变化及其对品质的影响', W: 720, H: 400,
      nodes: [N('L1',110,60,'碳水化合物','blue',150),N('L2',110,150,'蛋白质','blue',150),N('L3',110,240,'脂类','blue',150),N('L4',110,330,'维生素、色素','blue',150),
        N('R1',360,60,'美拉德、焦糖化\n淀粉糊化/老化'),N('R2',360,150,'变性、水解、交联'),N('R3',360,240,'氧化、水解、热聚合'),N('R4',360,330,'氧化降解、酶促褐变'),
        N('E1',610,60,'色泽：褐变/褪色','warn',170),N('E2',610,150,'质地：变硬/变软','warn',170),N('E3',610,240,'风味：香气/酸败味','warn',170),N('E4',610,330,'营养与安全','red',170)],
      edges: [['L1','R1'],['L2','R2'],['L3','R3'],['L4','R4'],['R1','E1'],['R1','E2'],['R2','E2'],['R2','E4'],['R3','E3'],['R3','E4'],['R4','E1'],['R4','E4']],
      steps: [
        { n: ['L1','R1','E1','E2'], e: [0,4,5], t: '碳水化合物：还原糖发生美拉德反应、糖类焦糖化导致褐变和产生香气；淀粉糊化使食品变软、老化使食品变硬。' },
        { n: ['L2','R2','E2','E4'], e: [1,6,7], t: '蛋白质：加热变性、冷冻变性、交联使溶解度和持水力下降，质地改变；过度加热损失赖氨酸，产生杂环胺。' },
        { n: ['L3','R3','E3','E4'], e: [2,8,9], t: '脂类：自动氧化和水解产生哈喇味；高温热聚合产生有害物，营养价值下降。' },
        { n: ['L4','R4','E1','E4'], e: [3,10,11], t: '维生素与色素：VC 氧化损失，叶绿素脱镁变褐，酚类发生酶促褐变。' },
        { n: [], e: [], t: '影响这些反应的主要因素：温度、时间、pH、水分活度、食品成分、氧和光、金属离子、包装。答情境题时按"成分 → 反应 → 品质影响 → 控制"的顺序写。' } ] },
    maillard: { title: '美拉德反应的三个阶段', W: 720, H: 482,
      nodes: [N('A1',110,50,'还原糖 + 氨基化合物','blue'),N('A2',110,150,'席夫碱\n（羰氨缩合）'),N('A3',110,250,'N-葡萄糖基胺'),N('A4',110,360,'Amadori 重排产物\n（1-氨基-1-脱氧-2-酮糖）','',210),
        N('B1',360,250,'脱水 → 糠醛 / HMF'),N('B2',360,350,'裂解 → 还原酮、\n二羰基化合物'),N('B3',360,440,'Strecker 降解 →\n醛 + CO₂（吡嗪香气）'),
        N('C1',600,300,'醇醛缩合\n醛-胺聚合'),N('C2',600,420,'类黑精（褐色）','brown'),N('X',480,90,'抑制：降温、降 pH、控水、\n亚硫酸盐、除糖、钙盐','good',240)],
      edges: [['A1','A2'],['A2','A3'],['A3','A4'],['A4','B1'],['A4','B2'],['B2','B3'],['B1','C1'],['B2','C1'],['C1','C2'],['X','A2','亚硫酸根与羰基加成',1]],
      steps: [
        { n: ['A1','A2','A3','A4'], e: [0,1,2], t: '初期：还原糖的羰基与氨基缩合成席夫碱，环化为 N-葡萄糖基胺，再经 Amadori 重排生成酮糖胺。此阶段无色，紫外吸收增强。' },
        { n: ['B1','B2','B3'], e: [3,4,5], t: '中期：重排产物脱水生成糠醛、羟甲基糠醛（HMF），裂解生成还原酮和二羰基化合物；二羰基化合物与氨基酸发生 Strecker 降解，生成醛和 CO₂，并产生吡嗪等香气物质。' },
        { n: ['C1','C2'], e: [6,7,8], t: '末期：醛类发生醇醛缩合、醛与胺聚合，生成含氮的褐色高分子"类黑精"。' },
        { n: ['X'], e: [9], t: '控制：五碳糖 > 六碳糖，碱性氨基酸更快；pH 3 以上 pH 越高越快；水分 10%–15% 最易发生；温度每升 10 ℃，速度增至 3–5 倍；Fe、Cu 促进，Ca 抑制；亚硫酸盐在初期加入有效，后期加入不能褪色。' } ] },
    oxid: { title: '油脂自动氧化：自由基链式反应', W: 720, H: 390,
      nodes: [N('RH',110,60,'不饱和脂肪酸 RH','blue'),N('R',110,190,'烷基自由基 R·'),N('ROO',360,190,'过氧自由基 ROO·'),N('ROOH',360,320,'氢过氧化物 ROOH\n（第一个中间产物）','warn'),
        N('dec',610,320,'分解 → 醛、酮、酸\n（哈喇味）','brown'),N('term',610,190,'链终止：R–R、ROOR\n（非自由基产物）'),N('init',360,60,'引发：光、热、金属离子','warn'),N('AH',610,60,'抗氧化剂 AH 供氢\n→ 稳定的 A·','good')],
      edges: [['RH','R','脱去 α-亚甲基 H'],['init','R','',1],['R','ROO','+ O₂'],['ROO','ROOH','+ RH'],['ROOH','R','同时再生 R·',1],['ROOH','dec','分解'],['ROO','term','结合'],['AH','ROO','截断链传递',1]],
      steps: [
        { n: ['RH','init','R'], e: [0,1], t: '链引发：在光、热、金属离子（或光敏氧化产生的 ¹O₂）作用下，双键旁的 α-亚甲基脱氢，生成烷基自由基 R·。' },
        { n: ['R','ROO','ROOH'], e: [2,3,4], t: '链传递：R· + O₂ → ROO·；ROO· + RH → ROOH + R·。新生成的 R· 继续反应，链式循环，ROOH 不断积累。' },
        { n: ['ROOH','dec'], e: [5], t: 'ROOH 不稳定，分解生成 RO· 和 ·OH，进一步生成小分子醛、酮、酸，产生哈喇味。' },
        { n: ['term'], e: [6], t: '链终止：自由基相互结合，生成二聚体等非自由基产物。' },
        { n: ['AH'], e: [7], t: '控制：酚类抗氧化剂（BHA、BHT、TBHQ、生育酚）向 ROO· 供氢，终止链传递；柠檬酸、EDTA 螯合金属；避光、隔氧、低温、控制 Aw ≈ 0.33。' } ] },
    enzbrown: { title: '酶促褐变的发生与控制', W: 720, H: 400,
      nodes: [N('ph',110,80,'酚类底物\n（绿原酸、儿茶素）','blue'),N('o2',110,200,'O₂','blue',120),N('ppo',110,320,'多酚氧化酶 PPO\n（含铜）','blue'),N('q',360,200,'邻醌'),N('mel',610,200,'聚合 → 黑色素（褐变）','brown'),
        N('c1',360,60,'热烫：70–95 ℃ 约 7 s','good'),N('c2',360,340,'调 pH < 3（柠檬酸）','good'),N('c3',610,60,'SO₂、抗坏血酸\n把醌还原为酚','good'),N('c4',610,340,'隔氧：浸水、真空、充氮','good')],
      edges: [['ph','q'],['o2','q'],['ppo','q','催化'],['q','mel','聚合'],['c1','ppo','钝化',1],['c2','ppo','抑制',1],['c3','q','还原',1],['c4','o2','隔绝',1]],
      steps: [
        { n: ['ph','o2','ppo'], e: [], t: '三个条件缺一不可：酚类底物、酚酶、氧。完整细胞中酚与醌保持平衡，组织破损后氧大量进入。' },
        { n: ['q','mel'], e: [0,1,2,3], t: 'PPO 催化酚类氧化为邻醌，醌积累后进一步氧化聚合，生成褐色的黑色素。' },
        { n: ['c1','c2'], e: [4,5], t: '针对酶：热烫使酶失活（以耐热的过氧化物酶作为指示酶）；降低 pH（酚酶最适 pH 6–7，pH < 3 失活）。' },
        { n: ['c3','c4'], e: [6,7], t: '针对醌和氧：SO₂、亚硫酸盐、抗坏血酸把醌还原成酚；浸在清水、糖水或盐水中，或真空、充氮包装。此外还可以加肉桂酸等底物类似物，或使底物甲基化。' } ] },
    starch: { title: '淀粉的糊化与老化', W: 720, H: 410,
      nodes: [N('raw',110,90,'生淀粉（β）\n结晶胶束','blue'),N('s1',360,90,'可逆吸水\n颗粒略胀'),N('s2',610,90,'不可逆吸水\n氢键断裂、膨润'),N('gel',610,240,'糊化：α-淀粉\n颗粒解体、黏度最大','good'),
        N('retro',360,240,'老化（β-化）\n微晶束、变硬变浑','brown'),N('use',110,240,'利用老化：粉丝、粉条\n防老化：方便面快速脱水','',210),N('f1',250,360,'老化快：2–4 ℃、含水 30%–60%、直链多','warn',290),N('f2',560,360,'防老化：>60 ℃ 或 <−20 ℃、糖、乳化剂、酶','good',300)],
      edges: [['raw','s1','加水加热'],['s1','s2'],['s2','gel'],['gel','retro','冷却放置'],['retro','gel','再加热（部分可逆）',1],['retro','use'],['f1','retro','',1],['f2','retro','',1]],
      steps: [
        { n: ['raw','s1','s2','gel'], e: [0,1,2], t: '糊化三阶段：可逆吸水（冷却干燥可复原，双折射不变）→ 不可逆吸水（结晶"溶解"，双折射开始消失）→ 颗粒解体（黏度最大，双折射完全消失）。' },
        { n: ['gel','retro'], e: [3,4], t: '老化：糊化淀粉在低温下放置，直链淀粉分子重新平行排列，氢键恢复形成微晶束。老化是糊化的逆过程，但不能完全恢复到生淀粉的结构。' },
        { n: ['f1','f2','use'], e: [5,6,7], t: '影响因素：直链淀粉多则易老化；2–4 ℃ 最快；含水量 30%–60% 最易；单双糖、糖醇、乳化剂、蛋白质、植物胶都能延缓老化。应用：方便面 80 ℃ 以上快速脱水，面包加乳化剂或 α-淀粉酶，粉丝粉条则是利用老化。' } ] },
    denat: { title: '蛋白质变性及其后果', W: 720, H: 390,
      nodes: [N('nat',110,190,'天然蛋白质\n有序紧密构象','blue'),N('fac',110,60,'变性因素：热、酸碱、有机\n溶剂、重金属、剧烈搅拌','warn',230),N('unf',360,190,'变性（展开）\n次级键断裂、疏水基外露'),N('ren',360,60,'复性：温和去除因素','good'),
        N('agg',610,110,'聚集 → 胶凝\n（豆腐、蛋白凝胶）'),N('prec',610,260,'溶解度下降\n生物活性丧失（最主要）','brown'),N('dig',360,330,'易被蛋白酶水解\n适度加热提高消化率','good')],
      edges: [['fac','nat','',1],['nat','unf'],['unf','ren','',1],['ren','nat','恢复天然构象'],['unf','agg'],['unf','prec'],['unf','dig']],
      steps: [
        { n: ['fac','nat','unf'], e: [0,1], t: '变性：理化因素破坏维持二、三、四级结构的次级键（氢键、疏水作用、离子键），分子从有序紧密变为松散无序，一级结构（肽键）不变。' },
        { n: ['ren'], e: [2,3], t: '可逆变性：除去变性因素后，在温和条件下部分蛋白质能恢复天然构象（复性）。' },
        { n: ['agg','prec','dig'], e: [4,5,6], t: '后果和应用：疏水基团暴露使溶解度下降；生物活性丧失；更易被酶解；分子聚集可形成凝胶（豆腐、蛋白凝胶、肉糜持水）；热烫使酶失活，加热使胰蛋白酶抑制剂失活。' } ] },
    refine: { title: '油脂精炼流程', W: 720, H: 300,
      nodes: [N('m',90,70,'毛油','brown',120),N('a',260,70,'沉降\n除不溶杂质',''),N('b',450,70,'脱胶\n除磷脂、部分蛋白',''),N('c',640,70,'脱酸（碱炼）\nNaOH 除游离脂肪酸','',160),
        N('d',640,210,'脱色\n白土/活性炭吸附色素','',160),N('e',450,210,'脱臭\n减压蒸汽蒸馏、加柠檬酸',''),N('f',260,210,'脱蜡（冬化）\n可选',''),N('g',90,210,'精炼油','good',120)],
      edges: [['m','a'],['a','b'],['b','c'],['c','d'],['d','e'],['e','f'],['f','g']],
      steps: [
        { n: ['m','a','b'], e: [0,1], t: '毛油含磷脂、色素、蛋白质、游离脂肪酸、异味物，甚至黄曲霉毒素、棉酚。脱胶：加热水使磷脂水合析出，防止加热时起泡、冒烟、焦化。' },
        { n: ['c'], e: [2], t: '脱酸：NaOH 中和游离脂肪酸生成皂脚分离，同时吸附部分色素和胶质。' },
        { n: ['d','e'], e: [3,4], t: '脱色：约 85 ℃ 用白土或活性炭吸附叶绿素（光敏化剂）、类胡萝卜素。脱臭：减压水蒸气蒸馏除去挥发性异味物，加柠檬酸螯合金属离子。' },
        { n: ['f','g'], e: [5,6], t: '脱蜡：冬化（低温结晶）除去蜡质，可加硅藻土助滤。目的总结：提高品质、改善风味、延长货架期。' } ] },
    chloro: { title: '叶绿素的变化途径', W: 720, H: 420,
      nodes: [N('chl',120,80,'叶绿素 a/b\n鲜绿，含 Mg²⁺','green'),N('pheo',370,80,'脱镁叶绿素\n橄榄褐','olive'),N('chlide',120,260,'脱植叶绿素\n绿色、水溶','green'),N('pheide',370,260,'脱镁脱植叶绿素\n橄榄褐','olive'),
        N('pyro',610,80,'焦脱镁叶绿素\n更褐','brown'),N('zn',610,260,'锌/铜代叶绿素\n鲜绿、稳定','green'),N('light',370,370,'光 + O₂：不可逆褪色','warn',230)],
      edges: [['chl','pheo','酸、热脱镁'],['chl','chlide','叶绿素酶（去植醇）'],['chlide','pheide','H⁺'],['pheo','pheide','叶绿素酶'],['pheo','pyro','久热'],['pheo','zn','Zn²⁺/Cu²⁺'],['pheide','zn','Zn²⁺/Cu²⁺']],
      steps: [
        { n: ['chl','pheo'], e: [0], t: '加热使叶绿素-蛋白复合体变性，叶绿素游离；有机酸、H₂S、CO₂ 使 pH 下降，H⁺ 置换 Mg²⁺，生成橄榄褐色的脱镁叶绿素。叶绿素在碱性中对热稳定，在酸性中易降解。' },
        { n: ['chlide','pheide'], e: [1,2,3], t: '叶绿素酶是唯一能直接作用于叶绿素的酶，水解去掉植醇，生成仍为绿色的脱植叶绿素；它再脱镁就变成褐色。' },
        { n: ['pyro'], e: [4], t: '长时间加热，脱镁叶绿素进一步脱去甲酯基，生成颜色更褐的焦脱镁叶绿素。' },
        { n: ['zn'], e: [5,6], t: '绿色再生：Zn²⁺、Cu²⁺ 进入卟啉环中心，生成稳定的绿色络合物（叶绿素铜钠）。' },
        { n: ['light'], e: [], t: '光解：失去蛋白保护后，在光和氧作用下发生不可逆褪色，所以要避光、除氧。护绿措施：加碱、高温短时、锌铜再生、低 Aw、气调、低温。' } ] },
    heme: { title: '肌红蛋白与肉色的转变', W: 720, H: 420,
      nodes: [N('mb',360,70,'肌红蛋白 Mb\nFe²⁺，紫红','purple'),N('mbo',120,230,'氧合肌红蛋白 MbO₂\nFe²⁺，鲜红','red',210),N('mmb',600,230,'高铁肌红蛋白 MMb\nFe³⁺，褐色','brown',210),
        N('nomb',360,230,'亚硝基肌红蛋白\n鲜红/粉红','pink'),N('nohc',360,370,'亚硝基血色原\n加热后稳定粉红','pink',210)],
      edges: [['mb','mbo','高氧分压 +O₂'],['mbo','mb','脱氧',1],['mb','mmb','低氧分压，氧化'],['mmb','mb','还原（抗坏血酸）',1],['mb','nomb','+NO（亚硝酸盐）'],['nomb','nohc','加热，珠蛋白变性']],
      steps: [
        { n: ['mb','mbo'], e: [0,1], t: '新切开的肉中肌红蛋白呈紫红色；与空气接触（高氧分压）后结合 O₂，生成鲜红色的氧合肌红蛋白。避氧低温贮藏的肉打开包装后呈鲜红色就是这个原因。' },
        { n: ['mmb'], e: [2,3], t: '低氧分压下 Fe²⁺ 易被氧化成 Fe³⁺，生成褐色的高铁肌红蛋白，肉色变暗。抗坏血酸可以把它还原。' },
        { n: ['nomb','nohc'], e: [4,5], t: '腌制发色：亚硝酸盐生成 NO，与肌红蛋白结合成亚硝基肌红蛋白；加热后生成稳定的粉红色亚硝基血色原。抗坏血酸钠、烟酰胺是发色助剂。' } ] },
    antho: { title: '花色苷随 pH 的结构与颜色变化', W: 720, H: 400,
      nodes: [N('ah',120,120,'黄烊盐阳离子 AH⁺\npH < 3：红','red',210),N('b',370,60,'甲醇假碱 B\npH 4–5：无色',''),N('a',370,200,'醌式碱 A\npH 6–7：紫','purple'),N('an',610,200,'醌式碱阴离子 A⁻\npH > 8：蓝','blue',210),
        N('c',610,60,'查尔酮 C\n开环：无色/黄','warn'),N('fe',120,320,'+Fe³⁺/Al³⁺ 络合\n蓝黑、灰紫',''),N('so2',370,330,'+SO₂ 加成\n无色（可逆漂白）','')],
      edges: [['ah','b','水合'],['ah','a','失 H⁺'],['a','an','失 H⁺'],['b','c','开环'],['ah','fe','',1],['ah','so2','',1]],
      steps: [
        { n: ['ah'], e: [], t: '酸性（pH < 3）时花色苷主要以红色的黄烊盐阳离子存在，最稳定。' },
        { n: ['b','c'], e: [0,3], t: 'pH 4–5 时水合生成无色的甲醇假碱，进一步开环生成无色或浅黄的查尔酮，颜色变淡、稳定性下降。' },
        { n: ['a','an'], e: [1,2], t: '中性附近为紫色醌式碱，碱性下为蓝色醌式碱阴离子（与类黄酮的黄色叠加可显绿色）。' },
        { n: ['fe','so2'], e: [4,5], t: '金属离子络合会变成蓝黑或灰紫色（不宜用铁锡容器）；SO₂ 加成使其褪色（低浓度可逆）。另外：羟基多偏蓝、稳定性差；甲氧基、糖基多偏红、更稳定；高温、光、氧加速降解。' } ] },
  };

  const COL = { '': ['var(--surface)','var(--line)'], blue: ['var(--c-blue)','var(--c-blue-b)'], warn: ['var(--c-warn)','var(--c-warn-b)'], red: ['var(--c-red)','var(--c-red-b)'],
    good: ['var(--c-good)','var(--c-good-b)'], green: ['var(--c-green)','var(--c-green-b)'], olive: ['var(--c-olive)','var(--c-olive-b)'], brown: ['var(--c-brown)','var(--c-brown-b)'],
    purple: ['var(--c-purple)','var(--c-purple-b)'], pink: ['var(--c-pink)','var(--c-pink-b)'] };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  function box(n) { const lines = n.label.split('\n'); return { w: n.w, h: 22 + lines.length * 18, lines }; }
  function edgePts(a, b) {
    const A = box(a), B = box(b);
    const clip = (n, bx, dx, dy) => { const sx = (bx.w / 2 + 6) / Math.abs(dx || 1e-9), sy = (bx.h / 2 + 6) / Math.abs(dy || 1e-9); const s = Math.min(sx, sy); return [n.x + dx * s, n.y + dy * s]; };
    const dx = b.x - a.x, dy = b.y - a.y;
    const p1 = clip(a, A, dx, dy), p2 = clip(b, B, -dx, -dy);
    return [p1, p2];
  }
  function svgGraph(g, step) {
    const act = step == null ? null : g.steps[step];
    const byId = Object.fromEntries(g.nodes.map(n => [n.id, n])); let labs = '';
    let s = `<svg viewBox="0 0 ${g.W} ${g.H}" class="dg" role="img" aria-label="${esc(g.title)}"><defs><marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="var(--muted)"/></marker><marker id="ar2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="var(--accent)"/></marker></defs>`;
    g.edges.forEach((e, i) => {
      const [f, t, lab, dash] = e; const A = byId[f], B = byId[t];
      let [[x1, y1], [x2, y2]] = edgePts(A, B);
      const on = act && act.e.includes(i); const dim = act && !on;
      const rev = g.edges.some(o => o[0] === t && o[1] === f);
      let path, lx, ly;
      if (rev) { const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, nx = -(y2 - y1), ny = x2 - x1, L = Math.hypot(nx, ny) || 1, k = 22; const cx = mx + nx / L * k, cy = my + ny / L * k; path = `M${x1},${y1} Q${cx},${cy} ${x2},${y2}`; lx = cx; ly = cy; }
      else { path = `M${x1},${y1} L${x2},${y2}`; lx = (x1 + x2) / 2; ly = (y1 + y2) / 2; }
      s += `<path d="${path}" fill="none" stroke="${on ? 'var(--accent)' : 'var(--muted)'}" stroke-width="${on ? 2.4 : 1.4}" ${dash ? 'stroke-dasharray="5 4"' : ''} marker-end="url(#${on ? 'ar2' : 'ar'})" opacity="${dim ? .25 : 1}"/>`;
      if (lab) labs += `<text x="${lx}" y="${ly - 5}" text-anchor="middle" class="dgl halo" opacity="${dim ? .3 : 1}">${esc(lab)}</text>`;
    });
    g.nodes.forEach(n => {
      const b = box(n), [bg, bd] = COL[n.c] || COL[''];
      const on = act && act.n.includes(n.id); const dim = act && !on && act.n.length;
      s += `<g opacity="${dim ? .32 : 1}"><rect x="${n.x - b.w / 2}" y="${n.y - b.h / 2}" width="${b.w}" height="${b.h}" rx="9" fill="${bg}" stroke="${on ? 'var(--accent)' : bd}" stroke-width="${on ? 2.6 : 1.2}"/>`;
      b.lines.forEach((l, i) => { s += `<text x="${n.x}" y="${n.y - (b.lines.length - 1) * 9 + i * 18 + 5}" text-anchor="middle" class="dgt${i ? ' sm' : ''}">${esc(l)}</text>`; });
      s += '</g>';
    });
    return s + labs + '</svg>';
  }
  /* ---------- 吸附等温线 ---------- */
  function gab(a) { const M = .06, C = 10, K = .9; return M * C * K * a / ((1 - K * a) * (1 - K * a + C * K * a)); }
  function chartMSI(aw) {
    const W = 680, H = 360, L = 56, B = 300, T = 20, R = 650, ymax = .5;
    const X = a => L + a * (R - L), Y = m => B - m / ymax * (B - T);
    const pts = (f) => { let d = ''; for (let i = 0; i <= 96; i++) { const a = i / 100; d += (i ? 'L' : 'M') + X(a).toFixed(1) + ',' + Y(Math.min(f(a), ymax)).toFixed(1); } return d; };
    const ad = a => gab(a), de = a => gab(a) * (1 + 1.6 * a * (1 - a) * (1 - a));
    let s = `<svg viewBox="0 0 ${W} ${H}" class="dg" role="img" aria-label="水分吸附等温线与滞后环">`;
    [[0, .25, 'Ⅰ 单分子层水'], [.25, .8, 'Ⅱ 多层水'], [.8, 1, 'Ⅲ 体相水']].forEach(([a, b, t], i) => { s += `<rect x="${X(a)}" y="${T}" width="${X(b) - X(a)}" height="${B - T}" fill="${i % 2 ? 'var(--c-blue)' : 'transparent'}" opacity=".45"/><text x="${(X(a) + X(b)) / 2}" y="${T + 16}" text-anchor="middle" class="dgl">${t}</text>`; });
    for (let i = 0; i <= 10; i += 2) s += `<line x1="${X(i / 10)}" x2="${X(i / 10)}" y1="${B}" y2="${B + 5}" stroke="var(--muted)"/><text x="${X(i / 10)}" y="${B + 20}" text-anchor="middle" class="dgl">${(i / 10).toFixed(1)}</text>`;
    s += `<line x1="${L}" y1="${B}" x2="${R}" y2="${B}" stroke="var(--muted)"/><line x1="${L}" y1="${T}" x2="${L}" y2="${B}" stroke="var(--muted)"/>`;
    s += `<text x="${(L + R) / 2}" y="${H - 8}" text-anchor="middle" class="dgt sm">水分活度 Aw</text><text x="16" y="${(T + B) / 2}" transform="rotate(-90 16 ${(T + B) / 2})" text-anchor="middle" class="dgt sm">含水量（g 水/g 干物质）</text>`;
    s += `<path d="${pts(de)}" fill="none" stroke="var(--c-red-b)" stroke-width="2.6"/><path d="${pts(ad)}" fill="none" stroke="var(--accent)" stroke-width="2.6"/>`;
    s += `<text x="${X(.52)}" y="${Y(de(.52)) - 8}" class="dgl" fill="var(--c-red-b)">解吸等温线</text><text x="${X(.6)}" y="${Y(ad(.6)) + 18}" class="dgl">回吸（吸附）等温线</text>`;
    if (aw != null) { const m1 = ad(aw), m2 = de(aw); s += `<line x1="${X(aw)}" x2="${X(aw)}" y1="${T}" y2="${B}" stroke="var(--ink)" stroke-dasharray="4 3"/><circle cx="${X(aw)}" cy="${Y(m1)}" r="5" fill="var(--accent)"/><circle cx="${X(aw)}" cy="${Y(Math.min(m2, ymax))}" r="5" fill="var(--c-red-b)"/>`; }
    return s + '</svg>';
  }
  /* ---------- 水分活度-稳定性图 ---------- */
  const AWC = [
    ['脂肪氧化', 'var(--c-warn-b)', a => a < .33 ? .62 - 1.414 * a : a < .75 ? .153 + (a - .33) * 1.52 : .79 - (a - .75) * 1.2],
    ['非酶褐变', 'var(--c-brown-b)', a => a < .2 ? 0 : Math.exp(-Math.pow((a - .68) / .14, 2)) * .9],
    ['酶促反应', 'var(--c-purple-b)', a => a < .3 ? 0 : Math.min(1, Math.pow((a - .3) / .7, 1.4))],
    ['霉菌', 'var(--c-olive-b)', a => a < .7 ? 0 : Math.min(1, (a - .7) / .25)],
    ['酵母', 'var(--c-pink-b)', a => a < .8 ? 0 : Math.min(1, (a - .8) / .17)],
    ['细菌', 'var(--c-red-b)', a => a < .9 ? 0 : Math.min(1, (a - .9) / .08)],
  ];
  function chartAW(aw) {
    const W = 680, H = 360, L = 50, B = 300, T = 20, R = 650;
    const X = a => L + a * (R - L), Y = v => B - v * (B - T);
    let s = `<svg viewBox="0 0 ${W} ${H}" class="dg" role="img" aria-label="水分活度与食品稳定性">`;
    for (let i = 0; i <= 10; i += 2) s += `<line x1="${X(i / 10)}" x2="${X(i / 10)}" y1="${T}" y2="${B}" stroke="var(--line)"/><text x="${X(i / 10)}" y="${B + 20}" text-anchor="middle" class="dgl">${(i / 10).toFixed(1)}</text>`;
    s += `<line x1="${L}" y1="${B}" x2="${R}" y2="${B}" stroke="var(--muted)"/><text x="${(L + R) / 2}" y="${H - 8}" text-anchor="middle" class="dgt sm">水分活度 Aw</text><text x="16" y="${(T + B) / 2}" transform="rotate(-90 16 ${(T + B) / 2})" text-anchor="middle" class="dgt sm">相对反应速率</text>`;
    { let d = ''; for (let i = 2; i <= 96; i++) { const a = i / 100; d += (i > 2 ? 'L' : 'M') + X(a).toFixed(1) + ',' + Y(Math.min(1, gab(a) / .42)).toFixed(1); } s += `<path d="${d}" fill="none" stroke="var(--muted)" stroke-dasharray="5 4"/><text x="${X(.86)}" y="${Y(.62)}" class="dgl">吸附等温线</text>`; }
    AWC.forEach(([n, c, f], k) => { let d = ''; for (let i = 0; i <= 100; i++) { const a = i / 100; d += (i ? 'L' : 'M') + X(a).toFixed(1) + ',' + Y(Math.max(0, Math.min(1, f(a)))).toFixed(1); } s += `<path d="${d}" fill="none" stroke="${c}" stroke-width="2.4"/>`; s += `<rect x="${L + 10 + (k % 3) * 120}" y="${T + 4 + Math.floor(k / 3) * 18}" width="12" height="4" fill="${c}"/><text x="${L + 26 + (k % 3) * 120}" y="${T + 10 + Math.floor(k / 3) * 18}" class="dgl" text-anchor="start">${n}</text>`; });
    s += `<line x1="${X(.33)}" x2="${X(.33)}" y1="${Y(0)}" y2="${Y(.25)}" stroke="var(--c-warn-b)" stroke-dasharray="3 3"/><text x="${X(.33)}" y="${Y(.27)}" text-anchor="middle" class="dgl">0.33 氧化最慢</text>`;
    if (aw != null) s += `<line x1="${X(aw)}" x2="${X(aw)}" y1="${T}" y2="${B}" stroke="var(--ink)" stroke-width="1.6"/>`;
    return s + '</svg>';
  }
  function awText(a) {
    const r = [];
    r.push(a < .2 ? '非常干燥：大多数反应很慢，但脂肪氧化反而较快（金属离子未被水合）。' : a < .4 ? '接近单分子层（约 0.33）：脂肪氧化最慢，是干燥食品最稳定的范围。' : a < .6 ? '中等水分：非酶褐变、酶促反应逐渐加快。' : a < .75 ? '非酶褐变高峰区（0.6–0.7）；耐旱霉菌和耐渗酵母开始可能生长。' : a < .9 ? '霉菌（约 0.80）、酵母（约 0.88）可以生长；脂肪氧化因稀释略降。' : '大多数细菌可以生长（约 0.90 以上），食品极易腐败。');
    return r.join('');
  }
  const CH = { msi: { title: '水分吸附等温线与滞后环', W: 680, render: chartMSI, info: a => `Aw = ${a.toFixed(2)}：回吸含水量约 ${gab(a).toFixed(3)}，解吸约 ${(gab(a) * (1 + 1.6 * a * (1 - a) * (1 - a))).toFixed(3)} g/g。同一 Aw 下解吸曲线的含水量更高，两线不重合即滞后现象。${a < .25 ? '处于Ⅰ区：单分子层（化合水、邻近水），最难除去，不能作溶剂。' : a < .8 ? '处于Ⅱ区：多层水，仍属结合水，溶剂能力部分降低。' : '处于Ⅲ区：体相水（自由水），可作溶剂、可被微生物利用。'}` },
    awmap: { title: '水分活度与食品稳定性', W: 680, render: chartAW, info: a => `Aw = ${a.toFixed(2)}：${awText(a)}` } };
  window.DG = {
    list: () => Object.keys(G).map(k => ({ id: k, title: G[k].title })).concat(Object.keys(CH).map(k => ({ id: k, title: CH[k].title }))),
    title: id => (G[id] || CH[id] || {}).title,
    mount(el, id) {
      if (CH[id]) {
        const c = CH[id]; let a = .5;
        el.innerHTML = `<div class="dgwrap">${c.render(a)}</div><label class="dgr"><span>拖动查看不同 Aw</span><input type="range" min="0.02" max="0.98" step="0.01" value="0.5" aria-label="水分活度"></label><p class="dgi"></p>`;
        const inp = el.querySelector('input'), info = el.querySelector('.dgi'), w = el.querySelector('.dgwrap');
        const up = () => { a = +inp.value; w.innerHTML = c.render(a); info.textContent = c.info(a); };
        inp.oninput = up; up(); return;
      }
      const g = G[id]; if (!g) { el.textContent = '没有找到这张图。'; return; }
      let st = -1;
      el.innerHTML = `<div class="dgwrap"></div><div class="dgnav"><button class="btn sm" data-a="prev">上一步</button><span class="dgc"></span><button class="btn sm pri" data-a="next">下一步</button><button class="btn sm ghost" data-a="all">看全图</button></div><p class="dgi"></p>`;
      const w = el.querySelector('.dgwrap'), info = el.querySelector('.dgi'), cnt = el.querySelector('.dgc');
      const draw = () => { w.innerHTML = svgGraph(g, st < 0 ? null : st); cnt.textContent = st < 0 ? `共 ${g.steps.length} 步` : `第 ${st + 1} / ${g.steps.length} 步`; info.textContent = st < 0 ? '点"下一步"按顺序看机理，每一步会高亮相关环节。' : g.steps[st].t; };
      el.querySelector('.dgnav').onclick = e => { const a = e.target.dataset.a; if (!a) return; if (a === 'next') st = Math.min(g.steps.length - 1, st + 1); if (a === 'prev') st = Math.max(-1, st - 1); if (a === 'all') st = -1; draw(); };
      draw();
    }
  };
})();
