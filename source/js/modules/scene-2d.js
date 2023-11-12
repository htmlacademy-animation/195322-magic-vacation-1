export class Scene2D {
  constructor(options) {
    this.canvas = document.querySelector(options.canvas);
    this.ctx = this.canvas.getContext(`2d`);
    this.size = 100;
    this.images = {};
    this.objects = {};
    this.objectsSettings = options.objectsSettings;
    this.locals = {};
    this.isLoaded = false;
    this.isWaitingForImages = false;
    this.isStarted = false;
    this.animations = [];
    this.afterInit = () => {};

    this.initObjects();

    this.initEventListeners();
    this.updateSize();
    this.loadImages(options.imagesUrls);
  }

  initObjects() {
    for (const name in this.objectsSettings) {
      if (Object.prototype.hasOwnProperty.call(this.objectsSettings, name)) {
        const obj = this.objectsSettings[name];

        this.objects[name] = {};
        this.objects[name].imageId = obj.imageId;
        this.objects[name].before = obj.before;
        this.objects[name].after = obj.after;
        this.objects[name].x = obj.x;
        this.objects[name].y = obj.y;
        this.objects[name].size = obj.size;
        this.objects[name].opacity = obj.opacity;

        this.objects[name].transforms = {};
        this.objects[name].transforms.rotate = obj.transforms.rotate;
        this.objects[name].transforms.translateX = obj.transforms.translateX;
        this.objects[name].transforms.translateY = obj.transforms.translateY;
        this.objects[name].transforms.scaleX = obj.transforms.scaleX;
        this.objects[name].transforms.scaleY = obj.transforms.scaleY;
      }
    }

    if (this.afterInit && typeof this.afterInit === `function`) {
      this.afterInit();
    }
  }

  initEventListeners() {
    window.addEventListener(`resize`, this.updateSize.bind(this));
  }

  initLocals() {}

  initAnimations() {}

  loadImages(imagesUrls) {
    let loadingCounter = 0;

    for (const name in imagesUrls) {
      if (Object.prototype.hasOwnProperty.call(imagesUrls, name)) {
        const image = new Image();

        image.addEventListener(`load`, () => {
          loadingCounter++;

          if (loadingCounter === Object.keys(imagesUrls).length) {
            this.isLoaded = true;

            if (this.isWaitingForImages) {
              this.start();
            } else {
              this.drawScene();
            }
          }
        });

        this.images[name] = image;

        image.src = imagesUrls[name];
      }
    }
  }

  start() {
    if (!this.isLoaded) {
      this.isWaitingForImages = true;

      return;
    }

    if (this.isStarted) {
      this.stop();
      this.initObjects();
    }

    if (this.animations.length === 0) {
      this.initAnimations();
    }

    this.animations.forEach((animation) => {
      animation.start();
    });

    this.isStarted = true;
  }

  stop() {
    this.animations.forEach((animation) => animation.stop());
  }

  drawScene() {
    this.clearScene();

    for (const name in this.objects) {
      if (Object.prototype.hasOwnProperty.call(this.objects, name)) {
        const object = this.objects[name];

        if (object.before && typeof object.before === `function`) {
          object.before();
        }

        this.drawImage(this.images[object.imageId], object);

        if (object.after && typeof object.after === `function`) {
          object.after();
        }
      }
    }
  }

  clearScene() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawImage(image, object) {
    let x = object.x;
    let y = object.y;
    let size = object.size;
    let opacity = object.opacity;
    let transforms = object.transforms;

    if (opacity === 0) {
      return;
    }

    if (transforms && (transforms.scaleX === 0 | transforms.scaleY === 0)) {
      return;
    }

    let width = this.size * (size / 100);
    let height = this.size * (size / 100) * (image.height / image.width);

    x = this.size * (x / 100) - (width / 2);
    y = this.size * (y / 100) - (height / 2);

    const isContextTransforming = opacity ||
      (transforms && (transforms.rotate || transforms.scaleX || transforms.scaleY));

    if (isContextTransforming) {
      this.ctx.save();
    }

    if (transforms) {
      if (transforms.translateX) {
        x += this.size * (transforms.translateX / 100);
      }

      if (transforms.translateY) {
        y += this.size * (transforms.translateY / 100);
      }

      if (transforms.rotate) {
        this.ctx.translate(x + width / 2, y + height / 2);
        this.ctx.rotate(transforms.rotate * Math.PI / 180);
      }

      if (transforms.scaleX) {
        width *= transforms.scaleX;

        if (transforms.scaleX < 0) {
          this.ctx.scale(-1, 1);

          x = -x;
        }
      }

      if (transforms.scaleY) {
        height *= transforms.scaleY;

        if (transforms.scaleY < 0) {
          this.ctx.scale(1, -1);

          y = -y;
        }
      }

      if (transforms.rotate) {
        this.ctx.translate(-x - width / 2, -y - height / 2);
      }
    }

    if (opacity) {
      this.ctx.globalAlpha = opacity;
    }

    this.ctx.drawImage(image, x, y, width, height);

    if (isContextTransforming) {
      this.ctx.restore();
    }
  }

  updateSize() {
    this.size = Math.min(window.innerWidth, window.innerHeight);

    this.canvas.height = this.size;
    this.canvas.width = this.size;
  }
}
