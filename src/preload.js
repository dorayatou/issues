class Preload {
    constructor(opts) {
        this.fileArr = opts.files;
        this.count = 0;
        this.percentage = 0;
    }

    preload() {
        // 执行这一步的时候，如果this.count = 1000，瞬间给网络发送1000个请求，性能怎么样呢？
        for(let i = 0; i < this.count; ++i) {
            let newImg = new Image();
            newImg.onload = function() {
                current++;
                if (nowNum === this.count) {
                    this.complete();
                }
                progress(current);
            };
        }
    }

    loadImg(file) {
        let newImg = new Image();
        newImg.onload = () => {
            newImg.onload = null;
            this.loadFn(newImg);
        }
        newImg.src = file;
    }

    loadFn(currentImg) {
        this.current++;
        if (this.progress) {
            let precentage = parseInt(this.current / this.fileArr.length * 100);
        }

        if (this.current === this.files.length) {
            if (this.complete) {
                this.complete();
            }
        }
    }

    complete() {
        console.log(`全部加载完毕——${this.count}`);
    }

    progress(current) {
        console.log(`当前进度-${current / this.count}`);
    }

    percentage() {
        return parseInt(this.current/this.fileArr.length);
    }

    box() {
        let box = document.createElement('div');
        box.style.cssText = `overflow:hidden;position:absolute;left:-9999px;top:0;width:1px;height:1px;`;
        document.body.appendChild(box);
    }
}