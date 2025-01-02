import{_ as i,c as s,o as a,e}from"./app-BpHkMvBE.js";const t={},n=e(`<p>前面我们了解到，<a href="https://tobebetterjavaer.com/thread/why-need-thread.html" target="_blank" rel="noopener noreferrer">多线程技术有很多好处</a>，比如说多线程可以充分利用多核 CPU 的计算能力，那多线程难道就没有一点缺点吗？</p><p>有。</p><p>多线程很难掌握，稍不注意，就容易使程序崩溃。我们以在路上开车为例：</p><p>在一个单向行驶的道路上，每辆汽车都遵守交通规则，这时候整体通行是正常的。『单向车道』意味着『一个线程』，『多辆车』意味着『多个 job 任务』。</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/thread/thread-bring-some-problem-c0a03b79-36d8-4120-888e-0597aa66ca5b.png" alt="单线程顺利同行" tabindex="0" loading="lazy"><figcaption>单线程顺利同行</figcaption></figure><p>如果需要提升车辆的同行效率，一般的做法就是扩展车道，对应程序来说就是『加线程池』，增加线程数。这样在同一时间内，通行的车辆数远远大于单车道。</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/thread/thread-bring-some-problem-a65346bc-7b8b-4883-9d85-d07859df2e69.png" alt="多线程顺利同行" tabindex="0" loading="lazy"><figcaption>多线程顺利同行</figcaption></figure><p>然而车道一旦多起来，『加塞』的场景就会越来越多，出现碰撞后也会影响整条马路的通行效率。这么一对比下来『多车道』就比『单车道』慢多了。</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/thread/thread-bring-some-problem-532930da-03fe-4a59-aee8-0b97b5f1a966.png" alt="多线程故障" tabindex="0" loading="lazy"><figcaption>多线程故障</figcaption></figure><p>防止汽车频繁变道加塞可以在车道间增加『护栏』，那在程序的世界里该怎么做呢？</p><p>多线程遇到的问题归纳起来就三类：<code>『线程安全问题』</code>、<code>『活跃性问题』</code>、<code>『性能问题』</code>。</p><h2 id="线程安全问题" tabindex="-1"><a class="header-anchor" href="#线程安全问题"><span>线程安全问题</span></a></h2><p>有时候我们会发现，明明在单线程环境中正常运行的代码，在多线程环境中就会出现意料之外的结果，这就是大家常说的『线程不安全』。那到底什么是线程不安全呢？</p><h3 id="原子性" tabindex="-1"><a class="header-anchor" href="#原子性"><span>原子性</span></a></h3><p>举一个银行转账的例子，比如从账户 A 向账户 B 转 1000 元，那么必然包括 2 个操作：从账户 A 减去 1000 元，往账户 B 加上 1000 元，两个操作都成功才意味着一次转账最终成功。</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/thread/thread-bring-some-problem-eba43c92-e42d-4318-a40c-b9365c32d922.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>试想一下，如果这两个操作不具备原子性，从 A 的账户扣减了 1000 元之后，操作突然终止了，账户 B 没有增加 1000 元，那问题就大了。</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/thread/thread-bring-some-problem-c22ae9be-bd80-4613-9c7e-3feb83c6c83f.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>银行转账有两个步骤，出现意外后导致转账失败，说明没有原子性。</p><blockquote><ul><li>原子性：即一个操作或者多个操作，要么全部执行并且执行的过程不会被任何因素打断，要么就都不执行。</li><li>原子操作：即不会被线程调度机制打断的操作，没有上下文切换。</li></ul></blockquote><p>在并发编程中很多操作都不是原子操作，出个小题目：</p><div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" data-title="java" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">int</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"> i </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> 0</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span><span style="--shiki-light:#A0A1A7;--shiki-dark:#7F848E;--shiki-light-font-style:italic;--shiki-dark-font-style:italic;"> // 操作1</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">i</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">++;</span><span style="--shiki-light:#A0A1A7;--shiki-dark:#7F848E;--shiki-light-font-style:italic;--shiki-dark-font-style:italic;">   // 操作2</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">int</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"> j </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;"> i</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span><span style="--shiki-light:#A0A1A7;--shiki-dark:#7F848E;--shiki-light-font-style:italic;--shiki-dark-font-style:italic;"> // 操作3</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">i </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;"> i </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">+</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> 1</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span><span style="--shiki-light:#A0A1A7;--shiki-dark:#7F848E;--shiki-light-font-style:italic;--shiki-dark-font-style:italic;"> // 操作4</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面这四个操作中哪些是原子操作，哪些不是呢？</p><p>有些小伙伴可能认为这些都是原子操作，其实只有操作 1 是原子操作。</p><ul><li>操作 1：这是原子操作，因为它是一个单一的、不可分割的步骤。</li><li>操作 2：这不是原子操作。这实际上是一个 &quot;read-modify-write&quot; 操作，它包括了读取 i 的值，增加 i，然后写回 i。</li><li>操作 3：这是原子操作，因为它是一个单一的、不可分割的步骤。</li><li>操作 4：这不是原子操作。和 i++ 一样，这也是一个 &quot;read-modify-write&quot; 操作。</li></ul><p>在单线程环境下上述四个操作都不会出现问题，但是在多线程环境下，如果不加锁的话，可能会得到意料之外的值。我们来测试一下，看看输出结果。</p><div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" data-title="java" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">public</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> class</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;"> YuanziDeo</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> {</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">    private</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> static</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> int</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"> i </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> 0</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">    public</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> static</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> void</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;"> main</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">String</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">[] </span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">args</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">)</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> throws</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;"> InterruptedException</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> {</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">        int</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"> numThreads</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;"> =</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> 2</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">        int</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"> numIncrementsPerThread</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;"> =</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> 100000</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">        Thread</span><span style="--shiki-light:#E45649;--shiki-dark:#ABB2BF;">[] </span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">threads</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;"> =</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> new</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;"> Thread</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">[numThreads];</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">        for</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> (</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">int</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"> j</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;"> =</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> 0</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">; j </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">&lt;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> numThreads; j++) {</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">            threads[j] </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> new</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;"> Thread</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(() </span><span style="--shiki-light:#C18401;--shiki-dark:#C678DD;">-&gt;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> {</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">                for</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> (</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">int</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"> k</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;"> =</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> 0</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">; k </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">&lt;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> numIncrementsPerThread; k++) {</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">                    i++;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">                }</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">            });</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">            threads[j].</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">start</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">();</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">        for</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> (</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">Thread</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"> thread</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> :</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> threads) {</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">            thread</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">join</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">();</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">        System</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">out</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">println</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;Final value of i = &quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;"> +</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> i);</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">        System</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">out</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">println</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;Expected value = &quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;"> +</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> (numThreads </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">*</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> numIncrementsPerThread));</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    }</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>输出如下：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>Final value of i = 102249</span></span>
<span class="line"><span>Expected value = 200000</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>i 期望的值为 200000，但实际跑出来的是 102249，这证明 i++ 不是一个原子操作，对吧？</p><h3 id="可见性" tabindex="-1"><a class="header-anchor" href="#可见性"><span>可见性</span></a></h3><p>talk is cheap，show me code，来看这段代码：</p><div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" data-title="java" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">class</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;"> Test</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> {</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">  int</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"> i </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> 50</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">  int</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"> j </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> 0</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">  public</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> void</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;"> update</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">()</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> {</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-dark:#7F848E;--shiki-light-font-style:italic;--shiki-dark-font-style:italic;">    // 线程1执行</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    i </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> 100</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">  }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">  public</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> int</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;"> get</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">()</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> {</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-dark:#7F848E;--shiki-light-font-style:italic;--shiki-dark-font-style:italic;">    // 线程2执行</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    j </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> i;</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">    return</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> j;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">  }</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>假如有两个线程，线程 1 执行 update 方法将 i 赋值为 100，一般情况下线程 1 会在自己的工作内存中完成赋值操作，但不会及时将新值刷新到主内存中。</p><p>这个时候线程 2 执行 get 方法，首先会从主内存中读取 i 的值，然后加载到自己的工作内存中，此时读到 i 的值仍然是 50，再将 50 赋值给 j，最后返回 j 的值就是 50 了。原本期望返回 100，结果返回 50，这就是可见性问题，线程 1 对变量 i 进行了修改，线程 2 并没有立即看到 i 的新值。</p><blockquote><p>可见性：当多个线程访问同一个变量时，一个线程修改了这个变量的值，其他线程能够立即看得到修改的值。</p></blockquote><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/thread/thread-bring-some-problem-d91ca0c2-4f39-4e98-90e2-8acb793eb983.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>如上图，每个线程都有属于自己的工作内存，工作内存和主内存间需要通过 store 和 load 等进行交互。</p><p>为了解决多线程的可见性问题，Java 提供了<code>volatile</code>这个关键字。当一个共享变量被 volatile 修饰时，它会保证修改的值立即更新到主存当中，这样的话，当有其他线程需要读取时，就会从内存中读到新值。普通的共享变量不能保证可见性，因为变量被修改后什么时候刷回到主存是不确定的，因此另外一个线程读到的可能就是旧值。</p><p>当然 Java 的锁机制如 synchronized 和 lock 也是可以保证可见性的。</p><h3 id="活跃性问题" tabindex="-1"><a class="header-anchor" href="#活跃性问题"><span>活跃性问题</span></a></h3><p>上面讲到为了解决<code>可见性</code>的问题，我们可以采取加锁的方式来解决，但如果加锁使用不当也容易引入其他问题，比如『死锁』。</p><p>在讲『死锁』之前，我们需要先引入另外一个概念：<code>活跃性问题</code>。</p><blockquote><p>活跃性是指某件正确的事情最终会发生，但当某个操作无法继续下去的时候，就会发生活跃性问题。</p></blockquote><p>概念可能有点拗口，活跃性问题一般有这样几类：<code>死锁</code>，<code>活锁</code>，<code>饥饿问题</code>。</p><h4 id="死锁" tabindex="-1"><a class="header-anchor" href="#死锁"><span>死锁</span></a></h4><p>死锁是指多个线程因为环形等待锁的关系而永远地阻塞下去。</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/thread/thread-bring-some-problem-d4e65d5f-3de1-4a1c-8ae1-02cb3bfb528c.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h4 id="活锁" tabindex="-1"><a class="header-anchor" href="#活锁"><span>活锁</span></a></h4><p>死锁是两个线程都在等待对方释放锁导致阻塞。而<code>活锁</code>的意思是线程没有阻塞，还活着呢。当多个线程都在运行并且都在修改各自的状态，而其他线程又依赖这个状态，就导致任何一个线程都无法继续执行，只能重复着自身的动作，于是就发生了活锁。</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/thread/thread-bring-some-problem-d1f9e916-0985-46fe-bf87-63fccfd27bae.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>举一个生活中的例子，大家平时在走路的时候，迎面走来一个人，两个人互相让路，但是又同时走到了一个方向，如果一直这样重复着避让，这俩人就发生了活锁，学到了吧，嘿嘿。</p><h4 id="饥饿" tabindex="-1"><a class="header-anchor" href="#饥饿"><span>饥饿</span></a></h4><p>如果一个线程无其他异常却迟迟不能继续运行，那基本上是处于饥饿状态了。</p><p>常见的有几种场景:</p><ul><li>高优先级的线程一直在运行消耗 CPU，所有的低优先级线程一直处于等待；</li><li>一些线程被永久堵塞在一个等待进入同步块的状态，而其他线程总是能在它之前持续地对该同步块进行访问；</li></ul><p>有一个非常经典的饥饿问题就是<code>哲学家用餐问题</code>，如下图所示，有五个哲学家在用餐，每个人必须要同时拿两把叉子才开始就餐，如果哲学家 1 和哲学家 3 同时开始就餐，那哲学家 2、4、5 就得饿肚子等待了。</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/thread/thread-bring-some-problem-314a47df-c953-4b7d-831c-007173981819.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h2 id="性能问题" tabindex="-1"><a class="header-anchor" href="#性能问题"><span>性能问题</span></a></h2><p>前面讲到了线程安全和死锁、活锁这些问题，如果这些都没有发生，多线程并发一定比单线程串行执行快吗？答案是不一定，因为多线程有<code>创建线程</code>和<code>线程上下文切换</code>的开销。</p><p>创建线程是直接向系统申请资源的，对操作系统来说，创建一个线程的代价是十分昂贵的，需要给它分配内存、列入调度等。</p><p>线程创建完之后，还会遇到线程<code>上下文切换</code>。</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/thread/thread-bring-some-problem-d125d0b9-3b60-46cd-a79f-a26dd5210b44.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>CPU 是很宝贵的资源，速度非常快，为了保证雨露均沾，通常会给不同的线程分配<code>时间片</code>，当 CPU 从执行一个线程切换到执行另一个线程时，CPU 需要保存当前线程的本地数据，程序指针等状态，并加载下一个要执行线程的本地数据，程序指针等，也就是『上下文切换』。</p><p>一般减少上下文切换的方法有：</p><ul><li>无锁并发编程：可以参照 <a href="https://javabetter.cn/thread/ConcurrentHashMap.html" target="_blank" rel="noopener noreferrer">ConcurrentHashMap</a> 锁分段的思想，不同的线程处理不同段的数据，这样在多线程竞争的条件下，可以减少上下文切换的时间。</li><li>CAS 算法，利用 <a href="https://javabetter.cn/thread/atomic.html" target="_blank" rel="noopener noreferrer">Atomic</a> + <a href="https://javabetter.cn/thread/cas.html" target="_blank" rel="noopener noreferrer">CAS</a> 算法来更新数据，采用乐观锁的方式，可以有效减少一部分不必要的锁竞争带来的上下文切换。</li><li>使用最少线程：避免创建不必要的线程，如果任务很少，但创建了很多的线程，这样就会造成大量的线程都处于等待状态。</li><li>协程：在单线程里实现多任务的调度，并在单线程里维持多个任务间的切换。</li></ul><h2 id="小结" tabindex="-1"><a class="header-anchor" href="#小结"><span>小结</span></a></h2><p>多线程用好了可以让程序的效率成倍提升，用不好可能比单线程还要慢。</p><p>用一张图来总结一下上面讲的：</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/thread/thread-bring-some-problem-119223c9-83a9-42e1-9a0c-f9c706a1e793.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><blockquote><p>编辑：沉默王二，编辑前的内容来自于朋友雷小帅的开源仓库<a href="https://github.com/CoderLeixiaoshuai/java-eight-part" target="_blank" rel="noopener noreferrer">Java 八股文</a>，内容很不错，强烈推荐。</p></blockquote><hr><p>GitHub 上标星 10000+ 的开源知识库《<a href="https://github.com/itwanger/toBeBetterJavaer" target="_blank" rel="noopener noreferrer">二哥的 Java 进阶之路</a>》第二份 PDF 《<a href="https://javabetter.cn/thread/" target="_blank" rel="noopener noreferrer">并发编程小册</a>》终于来了！包括线程的基本概念和使用方法、Java的内存模型、sychronized、volatile、CAS、AQS、ReentrantLock、线程池、并发容器、ThreadLocal、生产者消费者模型等面试和开发必须掌握的内容，共计 15 万余字，200+张手绘图，可以说是通俗易懂、风趣幽默……详情戳：<a href="https://javabetter.cn/thread/" target="_blank" rel="noopener noreferrer">太赞了，二哥的并发编程进阶之路.pdf</a></p><p><a href="https://javabetter.cn/thread/" target="_blank" rel="noopener noreferrer">加入二哥的编程星球</a>，在星球的第二个置顶帖「<a href="https://javabetter.cn/thread/" target="_blank" rel="noopener noreferrer">知识图谱</a>」里就可以获取 PDF 版本。</p><figure><img src="https://cdn.tobebetterjavaer.com/stutymore/mianshi-20240723112714.png" alt="二哥的并发编程进阶之路获取方式" tabindex="0" loading="lazy"><figcaption>二哥的并发编程进阶之路获取方式</figcaption></figure>`,75),l=[n];function h(r,p){return a(),s("div",null,l)}const k=i(t,[["render",h],["__file","thread-bring-some-problem.html.vue"]]),c=JSON.parse('{"path":"/thread/thread-bring-some-problem.html","title":"线程的安全问题：原子性、可见性、活跃性","lang":"zh-CN","frontmatter":{"title":"线程的安全问题：原子性、可见性、活跃性","shortTitle":"线程的安全性问题","description":"多线程技术有很多好处，比如说多线程可以充分利用多核 CPU 的计算能力，但如果使用不慎，就会出现『线程安全问题』『活跃性问题』『性能问题』等等。","category":["Java核心"],"tag":["Java并发编程"],"head":[["meta",{"name":"keywords","content":"Java,并发编程,多线程,Thread"}],["meta",{"property":"og:url","content":"https://javabetter.cn/thread/thread-bring-some-problem.html"}],["meta",{"property":"og:site_name","content":"二哥的Java进阶之路"}],["meta",{"property":"og:title","content":"线程的安全问题：原子性、可见性、活跃性"}],["meta",{"property":"og:description","content":"多线程技术有很多好处，比如说多线程可以充分利用多核 CPU 的计算能力，但如果使用不慎，就会出现『线程安全问题』『活跃性问题』『性能问题』等等。"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/thread/thread-bring-some-problem-c0a03b79-36d8-4120-888e-0597aa66ca5b.png"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-11-06T02:28:58.000Z"}],["meta",{"property":"article:author","content":"沉默王二"}],["meta",{"property":"article:tag","content":"Java并发编程"}],["meta",{"property":"article:modified_time","content":"2024-11-06T02:28:58.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"线程的安全问题：原子性、可见性、活跃性\\",\\"image\\":[\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/thread/thread-bring-some-problem-c0a03b79-36d8-4120-888e-0597aa66ca5b.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/thread/thread-bring-some-problem-a65346bc-7b8b-4883-9d85-d07859df2e69.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/thread/thread-bring-some-problem-532930da-03fe-4a59-aee8-0b97b5f1a966.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/thread/thread-bring-some-problem-eba43c92-e42d-4318-a40c-b9365c32d922.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/thread/thread-bring-some-problem-c22ae9be-bd80-4613-9c7e-3feb83c6c83f.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/thread/thread-bring-some-problem-d91ca0c2-4f39-4e98-90e2-8acb793eb983.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/thread/thread-bring-some-problem-d4e65d5f-3de1-4a1c-8ae1-02cb3bfb528c.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/thread/thread-bring-some-problem-d1f9e916-0985-46fe-bf87-63fccfd27bae.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/thread/thread-bring-some-problem-314a47df-c953-4b7d-831c-007173981819.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/thread/thread-bring-some-problem-d125d0b9-3b60-46cd-a79f-a26dd5210b44.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/thread/thread-bring-some-problem-119223c9-83a9-42e1-9a0c-f9c706a1e793.png\\",\\"https://cdn.tobebetterjavaer.com/stutymore/mianshi-20240723112714.png\\"],\\"dateModified\\":\\"2024-11-06T02:28:58.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"沉默王二\\",\\"url\\":\\"/about-the-author/\\"}]}"]]},"headers":[{"level":2,"title":"线程安全问题","slug":"线程安全问题","link":"#线程安全问题","children":[{"level":3,"title":"原子性","slug":"原子性","link":"#原子性","children":[]},{"level":3,"title":"可见性","slug":"可见性","link":"#可见性","children":[]},{"level":3,"title":"活跃性问题","slug":"活跃性问题","link":"#活跃性问题","children":[]}]},{"level":2,"title":"性能问题","slug":"性能问题","link":"#性能问题","children":[]},{"level":2,"title":"小结","slug":"小结","link":"#小结","children":[]}],"git":{"createdTime":1648037338000,"updatedTime":1730860138000,"contributors":[{"name":"沉默王二","email":"www.qing_gee@163.com","commits":2}]},"readingTime":{"minutes":9.87,"words":2961},"filePathRelative":"thread/thread-bring-some-problem.md","localizedDate":"2022年3月23日","excerpt":"<p>前面我们了解到，<a href=\\"https://tobebetterjavaer.com/thread/why-need-thread.html\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">多线程技术有很多好处</a>，比如说多线程可以充分利用多核 CPU 的计算能力，那多线程难道就没有一点缺点吗？</p>\\n<p>有。</p>\\n<p>多线程很难掌握，稍不注意，就容易使程序崩溃。我们以在路上开车为例：</p>\\n<p>在一个单向行驶的道路上，每辆汽车都遵守交通规则，这时候整体通行是正常的。『单向车道』意味着『一个线程』，『多辆车』意味着『多个 job 任务』。</p>"}');export{k as comp,c as data};