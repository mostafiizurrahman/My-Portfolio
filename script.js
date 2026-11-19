(() => {
    const section = document.querySelector("#hero");
    const stage = document.querySelector("#hero-container");
    const copy = document.querySelector("#hero-content");
    const image = document.querySelector("#hero-image");
    const scene = document.querySelector(".hero-scene");

    if (!section || !stage || !copy || !image || !scene) return;

    const seated = scene.querySelector(".dev-avatar--seated");
    const standing = scene.querySelector(".dev-avatar--standing");
    const warmBackdrop = image;
    const hint = stage.querySelector(".scroll-hint");
    const fadeOut = scene.querySelectorAll(".scene-note, .scene-shelf, .scene-monitor, .scene-plant, .scene-chair, .scene-desk, .scene-floor");
    const fadeIn = scene.querySelectorAll(".scene-stars, .scene-platform");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const light = [244, 240, 230];
    const dark = [20, 45, 104];
    let frame = 0;

    const clamp = (value) => Math.min(1, Math.max(0, value));

    function blendColor(progress) {
        const channels = light.map((start, index) => Math.round(start + (dark[index] - start) * progress));
        return `rgb(${channels.join(", ")})`;
    }

    function render() {
        frame = 0;
        if (reducedMotion.matches) {
            stage.style.backgroundColor = blendColor(0);
            copy.style.opacity = "1";
            copy.style.translate = "0 0";
            image.style.translate = "0 0";
            image.style.scale = "1";
            warmBackdrop.style.setProperty("--scene-progress", "0");
            if (seated) {
                seated.style.opacity = "1";
                seated.style.translate = "0 0";
                seated.style.scale = "1";
            }
            if (standing) {
                standing.style.opacity = "0";
                standing.style.translate = "0 0";
                standing.style.scale = "0.72";
            }
            fadeOut.forEach((element) => {
                element.style.opacity = "1";
                element.style.translate = "0 0";
            });
            fadeIn.forEach((element) => {
                element.style.opacity = "0";
                element.style.translate = "0 0";
            });
            if (hint) hint.style.opacity = "1";
            return;
        }

        const bounds = section.getBoundingClientRect();
        const travel = Math.max(1, section.offsetHeight - window.innerHeight);
        const progress = clamp(-bounds.top / travel);
        const isMobile = window.matchMedia("(max-width: 700px)").matches;
        const shiftX = isMobile ? 0 : -window.innerWidth * 0.19 * progress;

        stage.style.backgroundColor = blendColor(progress);
        copy.style.opacity = String(1 - clamp(progress / 0.48));
        copy.style.translate = `0 ${-38 * progress}px`;
        image.style.translate = `${shiftX}px ${-10 * progress}px`;
        image.style.scale = String(1 + progress * (isMobile ? 0.08 : 0.2));
        warmBackdrop.style.setProperty("--scene-progress", String(clamp(progress * 1.8)));

        if (seated) {
            seated.style.opacity = String(1 - clamp(progress / 0.52));
            seated.style.translate = `0 ${-55 * progress}px`;
            seated.style.scale = String(1 - progress * 0.16);
        }

        if (standing) {
            standing.style.opacity = String(clamp((progress - 0.3) / 0.55));
            standing.style.translate = `0 ${48 * (1 - progress)}px`;
            standing.style.scale = String(0.72 + progress * 0.28);
        }

        fadeOut.forEach((element) => {
            element.style.opacity = String(1 - clamp((progress - 0.06) / 0.44));
            element.style.translate = `0 ${-54 * progress}px`;
        });
        fadeIn.forEach((element) => {
            element.style.opacity = String(clamp((progress - 0.25) / 0.5));
            element.style.translate = `0 ${26 * (1 - progress)}px`;
        });

        if (hint) hint.style.opacity = String(1 - clamp(progress * 2));
    }

    function scheduleRender() {
        if (!frame) frame = window.requestAnimationFrame(render);
    }

    window.addEventListener("scroll", scheduleRender, { passive: true });
    window.addEventListener("resize", scheduleRender, { passive: true });
    reducedMotion.addEventListener?.("change", scheduleRender);
    scheduleRender();
})();
