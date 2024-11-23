(() => {
    var navEl = document.getElementById('theme-nav');
    navEl.addEventListener('click', (e) => {
        if (window.innerWidth <= 600) {
            if (navEl.classList.contains('open')) {
                navEl.style.height = ''
            } else {
                navEl.style.height = 48 + document.querySelector('#theme-nav .nav-items').clientHeight + 'px'
            }
            navEl.classList.toggle('open')
        } else {
            if (navEl.classList.contains('open')) {
                navEl.style.height = ''
                navEl.classList.remove('open')
            }
        }
    })
    window.addEventListener('resize', (e) => {
        if (navEl.classList.contains('open')) {
            navEl.style.height = 48 + document.querySelector('#theme-nav .nav-items').clientHeight + 'px'
        }
        if (window.innerWidth > 600) {
            if (navEl.classList.contains('open')) {
                navEl.style.height = ''
                navEl.classList.remove('open')
            }
        }
    })

    // a simple solution for managing cookies
    const Cookies = new class {
        get(key, fallback) {
            const temp = document.cookie.split('; ').find(row => row.startsWith(key + '='))
            if (temp) {
                return temp.split('=')[1];
            } else {
                return fallback
            }
        }
        set(key, value) {
            document.cookie = key + '=' + value + '; path=' + document.body.getAttribute('data-config-root')
        }
    }

    const ColorScheme = new class {
        constructor() {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { this.updateCurrent(Cookies.get('color-scheme', 'auto')) })
        }
        get() {
            const stored = Cookies.get('color-scheme', 'auto')
            this.updateCurrent(stored)
            return stored
        }
        set(value) {
            bodyEl.setAttribute('data-color-scheme', value)
            Cookies.set('color-scheme', value)
            this.updateCurrent(value)
            return value
        }
        updateCurrent(value) {
            var current = 'light'
            if (value == 'auto') {
                if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    current = 'dark'
                }
            } else {
                current = value
            }
            document.body.setAttribute('data-current-color-scheme', current)
        }
    }

    if (document.getElementById('theme-color-scheme-toggle')) {
        var bodyEl = document.body
        var themeColorSchemeToggleEl = document.getElementById('theme-color-scheme-toggle')
        var options = themeColorSchemeToggleEl.getElementsByTagName('input')

        if (ColorScheme.get()) {
            bodyEl.setAttribute('data-color-scheme', ColorScheme.get())
        }

        for (const option of options) {
            if (option.value == bodyEl.getAttribute('data-color-scheme')) {
                option.checked = true
            }
            option.addEventListener('change', (ev) => {
                var value = ev.target.value
                ColorScheme.set(value)
                for (const o of options) {
                    if (o.value != value) {
                        o.checked = false
                    }
                }
            })
        }
    }

    if (document.body.attributes['data-rainbow-banner']) {
        var shown = false
        switch (document.body.attributes['data-rainbow-banner-shown'].value) {
            case 'always':
                shown = true
                break;
            case 'auto':
                shown = new Date().getMonth() + 1 == parseInt(document.body.attributes['data-rainbow-banner-month'].value, 10)
                break;
            default:
                break;
        }
        if (shown) {
            var banner = document.createElement('div')

            banner.style.setProperty('--gradient', `linear-gradient(90deg, ${document.body.attributes['data-rainbow-banner-colors'].value})`)
            banner.classList.add('rainbow-banner')

            navEl.after(banner)
        }
    }

    if (document.body.attributes['data-toc']) {
        const content = document.getElementsByClassName('content')[0]
        const maxDepth = document.body.attributes['data-toc-max-depth'].value

        var headingSelector = ''
        for (var i = 1; i <= maxDepth; i++) {
            headingSelector += 'h' + i + ','
        }
        headingSelector = headingSelector.slice(0, -1)
        const headings = content.querySelectorAll(headingSelector)

        var source = []
        headings.forEach((heading) => {
            source.push({
                html: heading.innerHTML,
                href: heading.getElementsByClassName('headerlink')[0].attributes['href'].value
            })
        })

        const toc = document.createElement('div')
        toc.classList.add('toc')
        for (const i in source) {
            const item = document.createElement('p')
            const link = document.createElement('a')
            link.href = source[i].href
            link.innerHTML = source[i].html
            link.removeChild(link.getElementsByClassName('headerlink')[0])
            item.appendChild(link)
            toc.appendChild(item)
        }

        if (toc.children.length != 0) {
            document.getElementsByClassName('post')[0].getElementsByClassName('divider')[0].after(toc)
            const divider = document.createElement('div')
            divider.classList.add('divider')
            toc.after(divider)
        }
    }

    // 添加视差滚动逻辑
    document.addEventListener('scroll', function () {
        const parallaxElements = document.querySelectorAll('.parallax');
        const scrollTop = window.scrollY;
    
        parallaxElements.forEach((el) => {
            const speed = el.getAttribute('data-speed') || 0.5; // 读取速度属性
            const scaleStart = 1; // 初始缩放比例
            const scaleEnd = 0.5; // 最小缩放比例
            const opacityStart = 1; // 初始透明度
            const opacityEnd = 0; // 最小透明度
    
            // 计算缩放比例
            const scale = scaleStart - (scrollTop / 1000) * (scaleStart - scaleEnd); // 1000 为过渡的滚动范围
            const clampedScale = Math.max(scaleEnd, Math.min(scaleStart, scale)); // 确保缩放值在范围内
    
            // 计算透明度
            const opacity = opacityStart - (scrollTop / 400) * (opacityStart - opacityEnd);
            const clampedOpacity = Math.max(opacityEnd, Math.min(opacityStart, opacity)); // 确保透明度在范围内
    
            // 应用滚动效果
            el.style.transform = `translateY(${scrollTop * speed}px) scale(${clampedScale})`;
            el.style.opacity = clampedOpacity;
        });
    });

    document.addEventListener('DOMContentLoaded', () => {
        const body = document.body;
        const heroImage = document.querySelector('.large img');
    
        // 定义一个更新函数，根据 color-scheme 修改图片
        const updateImageSrc = () => {
            const colorScheme = body.getAttribute('data-color-scheme');
            if (heroImage) {
                if (colorScheme === 'dark') {
                    heroImage.src = 'https://www.helloimg.com/i/2024/11/23/6741b2f237da6.png';
                } else if (colorScheme === 'light') {
                    heroImage.src = 'https://www.helloimg.com/i/2024/11/23/6741d3ecc256f.png';
                }
            }
        };
    
        // 初始化时立即更新图片
        updateImageSrc();
    
        // 使用 MutationObserver 监听 data-color-scheme 的变化
        const observer = new MutationObserver(() => {
            updateImageSrc();
        });
    
        // 开始监听 body 的属性变化
        observer.observe(body, { attributes: true, attributeFilter: ['data-color-scheme'] });
    
        // 如果不再需要监听时，可以停止观察（根据需求）
        // observer.disconnect();
    });
    
})();
