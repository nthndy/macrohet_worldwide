/**
 * Readership Level System
 * Provides six tiers of text complexity for the manuscript.
 * Level 0: Original (manuscript as written)
 * Level 1: Undergraduate (first-year biology student)
 * Level 2: Science Enthusiast (pop-sci reader, no specialist knowledge)
 * Level 3: Pub Chat (plain-spoken explanation for a non-scientist)
 * Level 4: Child Friendly (ages 10-12, everyday analogies)
 * Level 5: Italian Uncle (your zio explains the science at Sunday lunch)
 */

const READERSHIP_LEVELS = [
    { id: 'original',    label: 'Original',           icon: '🔬', desc: 'Full manuscript' },
    { id: 'undergrad',   label: 'Undergraduate',      icon: '🎓', desc: 'First-year biology' },
    { id: 'enthusiast',  label: 'Science Enthusiast',  icon: '🧪', desc: 'Pop-science level' },
    { id: 'pub',         label: 'Pub Chat',            icon: '🍺', desc: 'Plain-spoken' },
    { id: 'child',       label: 'Child Friendly',      icon: '🌟', desc: 'Ages 10–12' },
    { id: 'italian',     label: 'Enrica',             icon: '🍝', desc: '🤌', hidden: true },
];

/**
 * Alternative text keyed by CSS selector (targeting the container whose
 * innerHTML we swap).  Level 0 is never stored — we cache the original
 * DOM on first activation.
 *
 * Each entry: { selector, levels: { 1: html, 2: html, 3: html } }
 */
const READERSHIP_CONTENT = [

    /* ── Abstract ── */
    {
        selector: '#abstract p',
        singleElement: true,
        levels: {
            1: `<p>Tuberculosis (TB) is caused by a bacterium called <i>Mycobacterium tuberculosis</i> (Mtb) that lives and multiplies inside our immune cells called macrophages. Mtb is generally considered a slow-growing organism, and this slow growth is thought to help it survive antibiotic treatment. However, nobody had really measured how fast individual bacteria grow inside individual human cells — until now. We built a microscopy system that films thousands of infected macrophages over several days and tracks every single bacterium inside them. We discovered that some Mtb populations actually grow <em>much faster</em> than expected — doubling in under 10 hours instead of the usual 20-24. Even more surprisingly, when we treated cells with standard TB antibiotics (rifampicin, isoniazid, and pyrazinamide), these fast growers were the ones most likely to survive. We confirmed this finding in a mouse model using a special fluorescent Mtb strain that reports how fast bacteria are dividing. Our results challenge the long-standing idea that slow-growing bacteria are the main problem for TB treatment — fast growers that dodge antibiotics are an important part of the picture too.</p>`,

            2: `<p>Tuberculosis (TB) is a major infectious disease caused by a bacterium that hides inside our immune cells. Scientists have always thought this bacterium grows slowly, and that this slowness helps it survive antibiotic treatment. But when researchers developed a way to film individual infected immune cells over days, they found something unexpected: some bacteria inside these cells were growing far faster than anyone had documented before — doubling their numbers in under 10 hours. The real surprise came when they added antibiotics. The fast-growing bacteria were actually <em>more likely</em> to survive treatment, not less. This was confirmed in mice, where the bacteria that kept multiplying quickly were linked to treatment failure. These findings flip the conventional thinking: it's not just dormant bacteria that are hard to kill — the fastest-growing ones are evading drugs too.</p>`,

            3: `<p>So TB is caused by a bug that hides inside your immune cells and is really hard to kill with antibiotics — treatment takes months. Everyone assumed the sneaky bacteria survive by going dormant, basically playing dead so drugs can't touch them. But these researchers built a system to watch individual infected cells under a microscope for days, and they found something no one expected: some of the bacteria were actually growing <em>ridiculously fast</em>. And here's the kicker — when they threw antibiotics at them, it was precisely those fast growers that survived. They checked it in mice too, same story. So the old idea that "slow bugs dodge drugs" isn't the whole picture. The speedsters are getting away with it too, and that matters for how we treat TB.</p>`,

            4: `<p>TB is a serious illness caused by tiny germs called bacteria. These bacteria are sneaky — they hide inside the body's security guards (cells called macrophages) that are supposed to destroy them. Doctors use special medicines called antibiotics to fight TB, but treatment takes a very long time. Scientists always thought the bacteria that survived medicine did so by "falling asleep" inside the cells, because sleeping bacteria are harder to kill. But when these researchers used powerful microscopes to watch what was really happening, they got a big surprise. Some bacteria were actually growing <em>really fast</em> — much faster than anyone expected. And those fast-growing ones were the best at surviving the medicine. They even checked this in mice, and the same thing happened. So it turns out it's not just the sleeping bacteria that are hard to beat — the speediest ones are escaping too.</p>`,

            5: `<p>Allura, senti — the tubercolosi is one bacteria molto brutta that she go hide herself INSIDE the cella of the immune, the one that suppose to kill her! Ma che fa? Nothing! The bacteria she stay and she multiply like is her house. The dottori they give the antibiotico but minchia it take-a so many months and nobody know why. Everybody always say "ahh the bacteria she sleep, for this the medicine no work." Ma these scienziate they look-a with the microscopio every cella one by one for many days and madonn' — some bacteria they no sleep nothing! They grow <em>VELOCE VELOCE</em>! And when they put the medicine? Proprio these fast ones they no die! They check also in the topi — same-a story! So senti, is not only the bacteria that sleep that make the problem. The fast ones also, they escape the medicine like my cugino when is time to pay. This change everything for the TB.</p>`,
        }
    },

    /* ── Introduction ── */
    {
        selector: '.introduction',
        containerMode: true, // swap all <p> children, keep the <h2>
        levels: {
            1: `<p>Tuberculosis (TB) is one of the deadliest infectious diseases in history, killing over a million people every year. Treating it requires at least four months of multiple antibiotics, and researchers still don't fully understand why such long treatment is needed.</p>
<p>The bacterium that causes TB — <i>Mycobacterium tuberculosis</i> (Mtb) — can live and replicate inside immune cells called macrophages. Inside the body, Mtb encounters very different environments depending on which cell it infects and where, leading to variation in how individual bacteria behave. There's evidence that the host cell itself affects how well antibiotics work, but the details aren't clear.</p>
<p>Mtb is traditionally described as a slow-growing bacterium, with a population doubling time of around 20-24 hours. This slow growth has been strongly linked to the ability of Mtb to tolerate antibiotics. Previous studies measuring Mtb growth inside cells reported similar bulk doubling times, but these averages hide a lot of variation between individual cells. Only recently have single-cell studies begun to reveal this variation, finding some bacteria can replicate faster than the average — down to about 17 hours.</p>
<p>Most antibiotic testing has been done in liquid culture in test tubes, which doesn't account for what happens inside host cells. Single-cell imaging inside cells is more physiologically relevant but has been limited by technical resolution. To overcome this, we built a high-throughput imaging platform that tracks Mtb growth inside individual human macrophages derived from stem cells (iPSDMs). We tested all three frontline TB antibiotics — pyrazinamide (PZA), isoniazid (INH), and rifampicin (RIF) — and discovered that a subpopulation of exceptionally fast-growing Mtb survives antibiotic treatment. We validated this in a mouse model, showing these growing bacteria persist during treatment and may represent a clinically important reservoir.</p>`,

            2: `<p>Tuberculosis (TB) kills more than a million people every year and has plagued humanity for thousands of years. Curing it requires months of taking multiple antibiotics, which is a big part of why TB remains so hard to control globally.</p>
<p>TB is caused by a bacterium called <i>Mycobacterium tuberculosis</i> that has a crafty survival strategy: it hides inside our own immune cells (macrophages), the very cells that are supposed to destroy it. Once inside, the bacteria can multiply — but until now, scientists could only measure the <em>average</em> growth rate across millions of bacteria, which masked what individual bugs were doing.</p>
<p>The textbook view is that Mtb grows slowly, doubling roughly once a day, and that this slowness helps it survive drug treatment. But when these researchers built a microscope system to watch thousands of individual infected cells over days, they found something surprising — and then tested whether it mattered for how well antibiotics work.</p>`,

            3: `<p>Right, so TB — tuberculosis — it's been around for thousands of years and it still kills over a million people annually. The treatment is brutal: you need to take a cocktail of antibiotics for <em>months</em>. Nobody really knows why it takes so long.</p>
<p>The bug that causes it — let's just call it Mtb — has this trick where it hides inside the very immune cells that are supposed to kill it. Bit like a burglar hiding in a police station. Once inside, it starts multiplying. Scientists always thought it grew slowly — about one division per day — and that this slowness was part of why drugs struggle to wipe it out.</p>
<p>But no one had actually watched individual bacteria growing inside individual human cells in real time with proper detail. So that's what this team did — they built a system to film it all. What they found challenges everything we thought we knew about why TB is so hard to treat.</p>`,

            4: `<p>TB is short for tuberculosis. It's a disease that has been making people sick for thousands of years, and it still causes a lot of harm around the world. To get better, patients have to take medicine every day for months — much longer than for most other illnesses.</p>
<p>TB is caused by a type of germ called a bacterium. This germ has a really sneaky trick: it hides inside the body's own security guards — special cells called macrophages whose job is to catch and destroy invaders. Imagine a bad guy sneaking into a police station and living there. That's basically what TB bacteria do.</p>
<p>Scientists always thought these bacteria grew slowly, and that being slow helped them hide from medicine. But nobody had really watched them closely enough to know for sure. So this team of researchers built a special microscope system to film everything — and what they discovered was a real surprise.</p>`,

            5: `<p>The TB — la tubercolosi — she been around for thousands and thousands of years and ancora today she kill more than one million persons every year. Pensa! And for the cure you need-a take the medicine every single day for MONTHS. Is terrible.</p>
<p>The bacteria that make the TB — she have one trick molto furba. She go hide inside the cella of the immune system — the one that is suppose to catch her and destroy her! Is like one ladra that go hide herself inside the questura, the police station, and she live there! Madonn'! And once she inside, she start to multiply.</p>
<p>The scienziate they always think this bacteria she grow slow, and that the slow growing help her hide from the medicine. Ma nobody ever really watch-a close enough to be sure. So these ricercatrici they build one special microscopio system to film everything — and what they find, minchia, nobody expect this.</p>`,
        }
    },

    /* ── Results Section 1: Pipeline ── */
    {
        selector: '#results-1 .results-text',
        levels: {
            1: `<p>We built a live-cell imaging system to watch Mtb growing inside macrophages in real time. We used human stem cell-derived macrophages (iPSDMs) that glow green, infected them with Mtb that glows red/magenta, and filmed them in 96-well plates for up to 75 hours at 30-60 minute intervals.</p>
<p>We also treated some macrophages with three frontline TB antibiotics (PZA, INH, RIF) at two concentrations each — a moderate dose (EC<sub>50</sub>) and a high dose (EC<sub>99</sub>) — to see how antibiotic pressure changes bacterial growth at the single-cell level.</p>
<p>After developing an image analysis pipeline for segmentation and tracking, we successfully tracked 18,152 macrophages. Looking at the intracellular Mtb signal over time revealed enormous variation: some cells had lots of bacteria multiplying quickly, while others had very little bacterial growth.</p>
<p>We noticed three distinct patterns in how intracellular Mtb burden changed: (i) genuine intracellular growth, where bacteria multiply inside the cell; (ii) uptake of extracellular bacteria; and (iii) transfer of bacteria from a neighbouring dying macrophage. The last two create sudden jumps in bacterial signal that aren't real intracellular growth, so we developed a classification system to separate "intrinsic" growth from these "extrinsic" events.</p>
<p>We fitted LOWESS smoothing curves to each growth trajectory and used the goodness-of-fit (R²) as a quality metric. Combined with manual inspection using napari, this allowed us to isolate 590 genuine intracellular doubling events from the total tracked population for detailed growth rate analysis.</p>`,

            2: `<p>The team built a microscope system that can film thousands of infected immune cells simultaneously for days on end. The macrophages (immune cells) glow green and the TB bacteria glow magenta, making it possible to track exactly how much bacteria each cell contains over time.</p>
<p>They also tested what happens when you add three different TB antibiotics at low and high doses. After filming, they used computer algorithms to identify and follow each individual cell, successfully tracking over 18,000 macrophages.</p>
<p>The data showed massive variation — some cells had bacteria multiplying rapidly inside them, while others barely had any growth. They also had to account for cases where a cell's bacterial load jumped suddenly, not because the bacteria inside were growing, but because the cell picked up extra bacteria from outside or inherited them from a dying neighbouring cell.</p>
<p>After carefully filtering out these false growth events using mathematical modelling and manual checks, they ended up with 590 clear examples of genuine intracellular bacterial doubling to analyse in detail.</p>`,

            3: `<p>Imagine setting up a time-lapse camera pointed at thousands of immune cells, each one potentially harbouring TB bacteria, and letting it run for three days straight. That's basically what they did. The immune cells glow green, the bacteria glow pink, and you can literally watch the bugs multiplying inside each cell.</p>
<p>They tracked over 18,000 individual cells this way. Some were absolutely packed with bacteria, others barely had any. They also had to be clever about distinguishing real bacterial growth from cases where a cell suddenly swallowed extra bacteria from outside or inherited them from a dead neighbour — because those look similar in the data but mean very different things.</p>
<p>After filtering all that out, they had about 590 solid cases of "this bacterium genuinely doubled inside this specific cell" to work with.</p>`,

            4: `<p>The scientists set up a very powerful microscope that works like a time-lapse camera. They pointed it at thousands of immune cells that had TB bacteria inside them, and filmed everything for three days straight. The clever part is that the immune cells glow green and the bacteria glow pink, so you can actually see the germs growing inside the cells — like watching a tiny nature documentary.</p>
<p>They watched over 18,000 cells this way. Some cells were full of bacteria, while others had hardly any. They also had to be careful: sometimes a cell looked like it suddenly had more bacteria, but it had actually just swallowed some from outside or picked them up from a dead neighbour cell. That's not the same as bacteria growing on their own.</p>
<p>After sorting out all the tricky cases, they found 590 clear examples where they could say "yes, this bacterium definitely doubled inside this cell." Those are the ones they studied closely.</p>`,

            5: `<p>Allura, these scienziate they set up one microscopio that work like the time-lapse camera no? They point at thousands and thousands of celle with the bacteria inside, and they film everything for three days. THREE DAYS! And the bella thing is — the celle of the immune they glow green, and the bacteria she glow pink, so you can see-a the bacteria growing inside like one piccola nature documentary.</p>
<p>They watch more than 18,000 celle like this. Some celle they full of bacteria, other ones almost nothing. Ma senti, they also have to be careful because sometimes one cella she look like she have more bacteria ma really she just swallow some from outside, or she take them from one cella next to her that die. Is not the same thing as the bacteria growing by herself inside!</p>
<p>After they sort out all this casino, they find 590 cases where they can say "sì, this bacteria she definitely double herself inside this cella." And those are the ones they study close.</p>`,
        }
    },

    /* ── Results Section 2: Doubling times ── */
    {
        selector: '#results-2 .results-text',
        levels: {
            1: `<p>We categorised the measured doubling times into three phenotypes: normal growth (16-24 hours), slow growth (≥24 hours), and fast growth (≤16 hours). Importantly, these phenotypes were often transient — the same cell could show different growth speeds at different times during the experiment.</p>
<p>In untreated cells, Mtb doubling times ranged from under 10 hours to over 70 hours, with a median of 25 hours. While this median is consistent with previous literature, 14% of the measured events were fast-growing (under 16 hours) — a substantial subpopulation not previously appreciated. Statistical modelling confirmed this distribution is bimodal: there's a distinct "actively replicating" cluster around 20 hours and a slower cluster around 45 hours. A less virulent mutant (Mtb ΔRD1) showed slower overall growth but maintained a similar proportion of fast growers (11%).</p>
<p>Under antibiotic treatment, the picture became striking. At moderate doses, RIF shifted bacteria towards slower growth, while PZA and INH had little effect on the distribution. But at high doses (EC<sub>99</sub>), where most bacteria stopped growing entirely, the rare survivors were dramatically enriched for fast growth. Under high-dose RIF, the proportion of fast growers jumped from 14% to 64%. Statistical tests confirmed these were non-random enrichments — fast-growing bacteria were significantly overrepresented in RIF- and INH-treated populations.</p>
<p>Flow cytometry analysis of macrophage surface markers showed no clear link between macrophage phenotype and bacterial growth rate, suggesting the heterogeneity is driven by the bacteria rather than the host cell.</p>`,

            2: `<p>When they measured how fast bacteria were doubling inside individual cells, they found enormous variation — from under 10 hours to over 70 hours per doubling. They split these into "fast" (under 16 hours), "normal" (16-24 hours), and "slow" (over 24 hours). In untreated cells, about 14% of bacterial populations were growing fast.</p>
<p>The really interesting finding came when they added antibiotics. At low doses, there wasn't much change. But at high doses — strong enough to stop the vast majority of bacteria from growing at all — the small number of bacteria that survived were overwhelmingly the fast growers. Under high-dose rifampicin (one of the key TB drugs), the percentage of fast-growing bacteria jumped from 14% to 64%.</p>
<p>In other words: the antibiotics preferentially killed the slow and normal growers, leaving the fast growers behind. This is the opposite of what the traditional model predicts — you'd expect slow/dormant bacteria to survive treatment, not the fast ones.</p>`,

            3: `<p>So they measured how fast the bacteria were multiplying inside each cell, and it was all over the place — some doubled in under 10 hours, others took more than 70. Think of it like a classroom: some students finish the exam in 20 minutes, most take an hour, and some are still there at the end.</p>
<p>Then they hit them with antibiotics. At normal doses, not much changed. But when they cranked the antibiotics up to kill-everything levels, something wild happened: nearly all the bacteria stopped growing, as expected. But the handful that survived? They were overwhelmingly the <em>fast</em> growers.</p>
<p>With the strongest dose of rifampicin (one of the main TB drugs), the proportion of fast growers in the survivors went from 14% to 64%. The antibiotics were basically wiping out the slow bacteria and leaving the speedsters standing. That's the exact opposite of what everyone assumed.</p>`,

            4: `<p>The scientists measured how quickly the bacteria were copying themselves inside each cell. The results were really varied — some bacteria doubled in less than 10 hours, while others took more than 70 hours. It's a bit like a race where some runners sprint and others walk.</p>
<p>Next, they added medicine (antibiotics) to fight the bacteria. At normal amounts, not much changed. But when they used really strong doses — enough to stop almost all the bacteria — something surprising happened. The few bacteria that survived were mostly the <em>fast</em> ones.</p>
<p>With the strongest dose of one important medicine called rifampicin, almost two-thirds of the survivors were fast growers. The medicine was getting rid of the slow bacteria but the speedy ones kept going. Scientists had always expected it would be the other way around — that slow, "sleeping" bacteria would be the survivors. This was a big surprise.</p>`,

            5: `<p>Allura they measure how fast the bacteria she copy herself inside every cella and madonn' — is all over the place. Some bacteria she double in less than 10 hours, others take more than 70! Is like one corsa where some they sprint and some they walk-a so slow you think they stop.</p>
<p>Then they put-a the medicine. At the normal dose, no change much. Ma when they use the dose molto forte — enough to stop almost all the bacteria — minchia, something crazy happen. The few bacteria that survive? They nearly all the <em>fast</em> ones!</p>
<p>With the strongest dose of one medicine that they call rifampicin, almost two out of three of the survivors they were the fast growers. The medicine she kill the slow bacteria ma the speedy ones they keep going like nothing happen. The scienziate they always expect is the other way — that the slow sleeping bacteria they survive. Ma no! Is the fast ones! Che sorpresa!</p>`,
        }
    },

    /* ── Results Section 3: Timer validation ── */
    {
        selector: '#results-3 .results-text',
        levels: {
            1: `<p>To independently confirm these findings, we used a different Mtb strain carrying a fluorescent "Timer" reporter. This reporter works like a biological speedometer — recently produced protein glows green, while older protein turns red. So the ratio of green to red fluorescence (GR ratio) indicates how actively the bacteria are dividing.</p>
<p>We validated the Timer reporter in test tubes first: when we stopped bacterial growth with a drug called chloramphenicol, the green signal dropped, confirming it responds to growth changes. We then infected macrophages and analysed them at different time points using flow cytometry.</p>
<p>At the whole-population level, the GR ratio shifted over 96 hours of infection, indicating the bacteria adapted their growth behaviour inside macrophages. At the single-cell level, we found a strong positive correlation between how much bacteria a cell contained and how actively those bacteria were dividing — cells with more bacteria had faster-growing populations.</p>
<p>Critically, when we added antibiotics, cells with high bacterial burden retained high GR ratios even when the overall amount of bacteria decreased. This means the surviving bacteria weren't dormant — they were actively replicating, consistent with our time-lapse findings.</p>`,

            2: `<p>To double-check their results with a completely different method, the team engineered TB bacteria with a built-in "growth speedometer" — a fluorescent protein that glows green when bacteria are dividing and shifts to red when they slow down. The ratio of green to red tells you how active the bacteria are.</p>
<p>Inside macrophages, they found that cells carrying more bacteria tended to have faster-growing populations. And when antibiotics were added, the bacteria that survived treatment were still actively growing — their "speedometer" stayed in the green. This independently confirmed that it's the growing bacteria, not the dormant ones, that evade drug treatment.</p>`,

            3: `<p>They wanted to double-check, so they engineered the bacteria with a sort of built-in traffic light. When the bugs are growing fast, they glow green. When they slow down, they go red. Think of it like a speedometer for bacteria.</p>
<p>And sure enough, the cells with the most bacteria had the greenest (fastest-growing) bugs. Even after antibiotics, the survivors were still glowing green — still actively dividing. So it wasn't just a fluke of the first experiment. The fast growers genuinely do survive treatment.</p>`,

            4: `<p>The scientists wanted to make sure their discovery was real, so they did a second experiment using a clever trick. They gave the bacteria a built-in "mood ring" — a special glow that changes colour depending on how fast the bacteria are growing. Fast-growing bacteria glow green, and slow ones turn red.</p>
<p>When they looked inside the immune cells, the ones packed with lots of bacteria had the greenest (fastest) germs. And even after adding medicine, the surviving bacteria were still glowing green — still growing fast. This proved that the first experiment wasn't a fluke. The fast growers really are the ones that survive.</p>`,

            5: `<p>The scienziate they want to be sure sure sure, so they do one second experiment with one trick molto furba. They give the bacteria like one anello dell'umore — how you say — one mood ring. When the bacteria she grow fast, she glow green. When she slow, she become red. Like one semaforo inside the bacteria!</p>
<p>And senti — the celle that have the most bacteria inside, they have the greenest bacteria. The fastest ones! And even after the medicine, the bacteria that survive they still glow green — still growing fast fast. So is not one mistake the first experiment. The fast ones they really are the ones that survive. Punto e basta.</p>`,
        }
    },

    /* ── Results Section 4: In vivo ── */
    {
        selector: '#results-4 .results-text',
        levels: {
            1: `<p>To test whether these findings hold in a living organism, we infected susceptible mice (C3HeB/FeJ strain, which develops TB lesions similar to those in humans) with the Timer-expressing Mtb via aerosol. After 8 weeks of infection, mice received either rifampicin, pyrazinamide, or a vehicle control by daily oral dosing for 3 weeks.</p>
<p>We developed an image analysis pipeline combining manual bacterial annotation with automated cell segmentation to quantify bacterial replication at the single-cell level in lung tissue sections. As expected, both RIF and PZA significantly reduced total bacterial burden compared to controls.</p>
<p>However, the single-cell analysis revealed something striking: the bacteria that survived antibiotic treatment maintained replication rates comparable to (RIF) or even higher than (PZA) untreated controls. There was a positive correlation between bacterial burden and replication rate across all treatment groups. The mice that failed to respond to therapy — particularly under PZA — had the highest proportion of actively dividing bacteria.</p>
<p>These findings demonstrate that growing intracellular Mtb populations are directly associated with antibiotic treatment failure in vivo.</p>`,

            2: `<p>Lab dishes are one thing — does this happen in a real infection? To find out, they infected mice with the "traffic light" TB bacteria and treated them with antibiotics for three weeks. They then looked at the lung tissue to see what bacteria survived.</p>
<p>The antibiotics did reduce the total amount of bacteria, as expected. But when they looked at individual cells in the lungs, the surviving bacteria were still actively growing — their fluorescent speedometer was still firmly in the "fast" zone. The mice that responded worst to treatment were the ones whose surviving bacteria were dividing the fastest.</p>
<p>This confirmed their cell-culture results in a real infection: fast-growing TB bacteria survive antibiotic treatment in living animals.</p>`,

            3: `<p>Okay, but does this actually happen in a real infection, not just in a dish? So they infected mice with the "traffic light" TB bacteria, waited for proper infections to develop, then gave them antibiotics for three weeks — same drugs used on human patients.</p>
<p>The drugs did their job overall — bacterial numbers dropped. But when they zoomed in on individual cells in the lungs, the bugs that survived were still growing fast. The mice that responded worst to treatment? They had the fastest-growing survivors.</p>
<p>So it's not just a lab curiosity. In a real, living, breathing infection, the fast growers are the ones getting away.</p>`,

            4: `<p>Everything so far was done with cells in a dish. But the scientists needed to know: does this happen inside a real, living body? So they gave mice a TB infection using the special colour-changing bacteria. After the mice got properly sick, the scientists gave them medicine for three weeks — the same kind of medicine that human TB patients take.</p>
<p>The medicine did help — there were fewer bacteria overall. But when the scientists looked really closely at the lungs, the bacteria that were still alive were the fast-growing ones. And the mice that didn't get better? They had the fastest-growing bacteria of all.</p>
<p>This showed that it's not just something that happens in a lab dish. In a real body, the speedy bacteria are the hardest to get rid of.</p>`,

            5: `<p>Va bene, ma senti — everything before this they do in the piatto, in the dish. Ma the scienziate they need to know: this happen also inside one body that is alive? So they give the topi — the mice — the infection of TB with the bacteria special that change the colour. After the topi they get properly sick, they give them the medicine for three weeks — same medicine like the human patients take.</p>
<p>The medicine she help — less bacteria overall, sì. Ma when they look-a close at the individual celle in the polmoni — the lungs — the bacteria that still alive? They the fast ones. And the topi that no get better? Minchia, they have the fastest bacteria of all.</p>
<p>So is not just something that happen in the laboratorio. In the real body, the speedy bacteria they the most difficult to kill. Stessa storia.</p>`,
        }
    },

    /* ── Discussion ── */
    {
        selector: '#discussion .results-text',
        levels: {
            1: `<p>This study reveals that Mtb can adopt a wide range of intracellular growth speeds, and that this variation matters for antibiotic treatment. While previous studies had hinted at growth heterogeneity, our approach is the first to quantify it at the single-cell level in human macrophages under antibiotic pressure. Fast-growing Mtb within macrophages aren't just rare outliers — they persist during infection and are found in both human TB and mouse models.</p>
<p>The traditional view is that antibiotic tolerance comes from bacteria going dormant. Our data show the opposite can also be true: fast-growing bacteria survive and are enriched by antibiotic treatment. This may happen because rapidly dividing bacteria outpace the drug's killing capacity, fail to accumulate sufficient drug, or actively pump drugs out faster. Each of the three antibiotics we tested showed a different relationship with bacterial growth rate.</p>
<p>Rifampicin (RIF) showed the strongest enrichment of fast growers at high doses, potentially because rapidly transcribing bacteria can tolerate RNA polymerase inhibition. Isoniazid (INH) targets cell wall synthesis in dividing bacteria, but fast growers may produce cell wall components faster than the drug can block them. Pyrazinamide (PZA) showed less enrichment in cell culture but clear evidence of fast-growing survivors in mice, suggesting the host environment matters for PZA activity.</p>
<p>These findings have implications for TB treatment strategy. Alongside the well-known problem of dormant bacteria surviving treatment, our data show that fast-growing bacteria also evade drugs. Understanding both of these populations will be important for developing better TB therapies.</p>`,

            2: `<p>This study changes how we think about antibiotic resistance in TB. The traditional view was simple: bacteria go dormant, drugs can't kill dormant bacteria, so dormancy equals survival. But these results show there's another escape route — growing fast.</p>
<p>Each of the three main TB drugs was affected differently. Rifampicin treatment actually <em>selected for</em> fast growers most strongly — at the highest dose, nearly two-thirds of survivors were fast-growing. Isoniazid and pyrazinamide showed similar but less dramatic effects. In mice, the link between fast growth and treatment failure was clear across all drugs.</p>
<p>Why might fast growth help bacteria survive drugs? Several possibilities: they might be dividing faster than drugs can kill them, they might not accumulate enough drug inside, or they might be better at pumping drugs back out. Whatever the mechanism, these findings mean TB researchers and drug developers need to think about fast-growing bacteria as an additional target alongside dormant ones.</p>`,

            3: `<p>So what does all this mean? Basically, for decades everyone assumed the TB bacteria that survive treatment do so by going to sleep — if you're not growing, drugs can't get you. And that's partly true. But what this study shows is that some bacteria take the <em>opposite</em> strategy: they grow so fast they basically outrun the drugs. It's like the difference between hiding from a predator and simply being faster than it.</p>
<p>Each of the three main TB drugs they tested showed this effect to different degrees. Rifampicin was the most dramatic — at the strongest dose, nearly two-thirds of the survivors were the fast growers. In mice, the ones that failed to clear their infection were the ones with the fastest-dividing bacteria.</p>
<p>The bottom line? If we want to cure TB more effectively, we can't just worry about the sleepy bacteria. We need to figure out how to catch the sprinters too.</p>`,

            4: `<p>So what did the scientists learn from all this? For a long time, everyone thought TB bacteria survive medicine by "falling asleep." Sleeping bacteria are harder to kill because the medicine targets things that only happen when bacteria are active. That idea is partly right. But this study found that some bacteria use the <em>opposite</em> trick — they grow so fast that the medicine can't keep up. Imagine trying to pull weeds out of a garden, but some weeds grow back faster than you can pull them.</p>
<p>They tested three different medicines, and each one had the same basic problem: the fastest-growing bacteria were the hardest to get rid of. One medicine called rifampicin showed this most clearly — almost two-thirds of the survivors were fast growers.</p>
<p>What this means for the future is that scientists need to think about both kinds of tricky bacteria: the sleepy ones <em>and</em> the speedy ones. If new medicines can tackle both, TB could become much easier to cure.</p>`,

            5: `<p>Allura, che significa tutto questo? For so many years everybody think the bacteria of TB she survive the medicine because she go to sleep — if you no grow, the medicine no can touch you. And sì, is partly true. Ma this study she show that some bacteria they do the <em>opposite</em> — they grow so fast that the medicine no can keep up! Is like you try to pull the erbacce from the garden ma some they grow back more fast than you can pull them. Impossibile!</p>
<p>They test three different medicine and every one have the same problem — the bacteria più veloce they the most difficult to kill. One medicine they call rifampicin she show this the most clear — almost two from three of the survivors they were the fast ones. Pensa!</p>
<p>What this mean for the future? The scienziate they need to think about BOTH type of furba bacteria: the ones that sleep <em>and</em> the ones that go fast. If the new medicine she can get both, maybe the TB she become much more easy to cure. Speriamo!</p>`,
        }
    },
];


/* ─────────────────────────────────────────────
   UI + DOM LOGIC
   ───────────────────────────────────────────── */

function initializeReadership() {
    let currentLevel = 0;
    const originalContent = new Map(); // selector → original innerHTML

    // ── Build the floating UI ──
    const wrapper = document.createElement('div');
    wrapper.id = 'readership-widget';
    wrapper.innerHTML = `
        <button id="readership-toggle" aria-label="Need help?" title="Need help?">
            <span class="readership-toggle-label">Need help?</span>
            <span class="readership-toggle-icon">📖</span>
        </button>
        <div id="readership-panel" class="readership-panel hidden">
            <div class="readership-panel-header">
                <span class="readership-panel-title">Need help?</span>
                <span class="readership-panel-close">&times;</span>
            </div>
            <div class="readership-panel-explainer">
                <h4>What is this?</h4>
                <p>This is an interactive manuscript — a research paper designed to be explored, not just read. Figures can be clicked to reveal high-resolution images and videos. Plots are interactive: hover over data points for details. The table of contents can be accessed by hovering over the title card.</p>
                <p>Use the <strong>Readership Level</strong> selector below to adjust the complexity of the written text. The original manuscript text, figures, and captions remain available at all times.</p>
            </div>
            <div class="readership-panel-divider"></div>
            <div class="readership-panel-section-title">Readership Level</div>
            <div class="readership-panel-body">
                ${READERSHIP_LEVELS.map((lvl, i) => `
                    <button class="readership-option ${i === 0 ? 'active' : ''} ${lvl.hidden ? 'readership-easter-egg' : ''}" data-level="${i}" ${lvl.hidden ? 'style="display:none"' : ''}>
                        <span class="readership-option-icon">${lvl.icon}</span>
                        <span class="readership-option-text">
                            <span class="readership-option-label">${lvl.label}</span>
                            <span class="readership-option-desc">${lvl.desc}</span>
                        </span>
                    </button>
                `).join('')}
            </div>
        </div>
    `;
    document.body.appendChild(wrapper);

    // ── Start hidden, reveal on scroll or TOC interaction ──
    wrapper.classList.add('readership-hidden');
    let revealed = false;

    function revealWidget() {
        if (revealed) return;
        revealed = true;
        wrapper.classList.remove('readership-hidden');
        wrapper.classList.add('readership-entering');
    }

    // Trigger 1: scroll past the title card
    const titleCard = document.querySelector('.title-card-flip-container') ||
                      document.querySelector('.title-header');
    if (titleCard) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0] && !entries[0].isIntersecting) {
                revealWidget();
                observer.disconnect();
            }
        }, { threshold: 0 });
        observer.observe(titleCard);
    }

    // Trigger 2: TOC link clicked (event delegation — links are built dynamically)
    const tocNav = document.getElementById('toc-nav');
    const sidebarNav = document.getElementById('sidebar-nav');
    [tocNav, sidebarNav].forEach(nav => {
        if (nav) nav.addEventListener('click', (e) => {
            if (e.target.closest('a')) revealWidget();
        });
    });

    // Trigger 3: title card clicked (flip to TOC counts as engagement)
    const flipContainer = document.querySelector('.title-card-flip-container');
    if (flipContainer) {
        flipContainer.addEventListener('click', () => revealWidget());
    }

    // ── References ──
    const toggle = document.getElementById('readership-toggle');
    const panel  = document.getElementById('readership-panel');
    const close  = panel.querySelector('.readership-panel-close');

    // ── Easter egg: click any level button 6 times to reveal Enrica ──
    let eggClicks = 0;
    let eggTimer = null;
    let eggRevealed = false;

    toggle.addEventListener('click', () => panel.classList.toggle('hidden'));
    close.addEventListener('click',  () => panel.classList.add('hidden'));

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!wrapper.contains(e.target)) panel.classList.add('hidden');
    });

    // ── Level buttons ──
    panel.querySelectorAll('.readership-option').forEach(btn => {
        btn.addEventListener('click', () => {
            const level = parseInt(btn.dataset.level);

            // Easter egg counter (only count visible level clicks)
            if (!eggRevealed && !btn.classList.contains('readership-easter-egg')) {
                eggClicks++;
                clearTimeout(eggTimer);
                eggTimer = setTimeout(() => { eggClicks = 0; }, 4000);
                if (eggClicks >= 6) {
                    eggRevealed = true;
                    const hidden = panel.querySelector('.readership-easter-egg');
                    if (hidden) {
                        hidden.style.display = '';
                        hidden.classList.add('readership-egg-reveal');
                    }
                }
            }

            if (level === currentLevel) return;
            setLevel(level);
            panel.querySelectorAll('.readership-option').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    function setLevel(level) {
        READERSHIP_CONTENT.forEach(entry => {
            if (entry.singleElement) {
                // Target is a single element (e.g. the abstract <p>)
                const el = document.querySelector(entry.selector);
                if (!el) return;
                if (!originalContent.has(entry.selector)) {
                    originalContent.set(entry.selector, el.outerHTML);
                }
                if (level === 0) {
                    el.outerHTML = originalContent.get(entry.selector);
                } else {
                    el.outerHTML = entry.levels[level];
                }
            } else if (entry.containerMode) {
                // Swap all <p> children but keep heading
                const section = document.querySelector(entry.selector);
                if (!section) return;
                if (!originalContent.has(entry.selector)) {
                    originalContent.set(entry.selector, section.innerHTML);
                }
                if (level === 0) {
                    section.innerHTML = originalContent.get(entry.selector);
                } else {
                    const heading = section.querySelector('h2');
                    const headingHTML = heading ? heading.outerHTML : '';
                    section.innerHTML = headingHTML + entry.levels[level];
                }
            } else {
                // Default: swap innerHTML of matched container
                const el = document.querySelector(entry.selector);
                if (!el) return;
                if (!originalContent.has(entry.selector)) {
                    originalContent.set(entry.selector, el.innerHTML);
                }
                if (level === 0) {
                    el.innerHTML = originalContent.get(entry.selector);
                } else {
                    el.innerHTML = entry.levels[level];
                }
            }
        });

        currentLevel = level;

        // Visual feedback: brief flash on changed sections
        document.querySelectorAll('.results-text, .introduction, #abstract p, #discussion .results-text').forEach(el => {
            el.classList.add('readership-flash');
            setTimeout(() => el.classList.remove('readership-flash'), 600);
        });
    }
}

// Fire after DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeReadership);
} else {
    initializeReadership();
}
