function createCanvas(props, id, callback) {
  // const canvas = document.createElement("canvas");
  const canvas = document.createElement("canvas");
  canvas.id = id || new Date().getTime();

  const { backgroundImg, width, watermark = [] } = props;

  let ratio = 1;

  const renderCanvas = () => {
    const ctx = canvas.getContext("2d");
    const image = new Image(); // Using optional size for image
    image.onload = drawImageActualSize; // Draw when image has loaded
    image.src = backgroundImg;
    addUserWatermark();
    function drawImageActualSize() {
      ratio = (width || document.body.offsetWidth) / image.naturalWidth; // 比例
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      ctx.width = canvas.width;
      ctx.height = canvas.height; // 计算等比缩小后图片
      ctx.drawImage(image, 0, 0, ctx.width, ctx.height);

      if ((watermark || []).length) {
        addUserWatermark();
      } else {
        addAntiFakeWatermark();
      }
    }
  };

  const addImageWatermark = (data) => {
    return new Promise((resolve, reject) => {
      const ctx = canvas.getContext("2d");

      const image = new Image(); // Using optional size for image
      image.onload = drawImageActualSize; // Draw when image has loaded
      image.src = data.contents;

      function drawImageActualSize() {
        // @ts-ignore
        ctx.drawImage(
          image,
          data.position.left,
          data.position.top,
          data.size.width,
          data.size.height
        );

        resolve(null);
      }
    });
  };

  const addTextWatermark = (data) => {
    const ctx = canvas.getContext("2d");

    ctx.font = `${18}px ''`;
    // ctx.fillStyle = "rgba(255, 255, 255, .5)";

    ctx.fillText(data.contents, data.position.left, data.position.top);
  };

  // 添加用户的水印
  const addUserWatermark = () => {
    const watermark = props.watermark || [];

    watermark.forEach(async (itemWatermark) => {
      if (itemWatermark.type === "image") {
        await addImageWatermark(itemWatermark);
      }
      if (itemWatermark.type === "text") {
        addTextWatermark(itemWatermark);
      }
    });

    canvas.style.transform = `scale(${ratio})`;
    canvas.style.marginTop = `-${(canvas.height * (1 - ratio)) / 2}px`;
    canvas.style.marginLeft = `-${(canvas.width * (1 - ratio)) / 2}px`;
    callback(canvas);
  };

  // 加文字水印 这个水印是应用的水印防止用户截图
  const addAntiFakeWatermark = () => {
    const ctx = canvas.getContext("2d");

    ctx.font = `${18 / ratio}px ''`;
    ctx.fillStyle = "rgba(255, 255, 255, .5)";
    ctx.translate(0, 0);
    ctx.rotate((Math.PI / 180) * 15); //旋转

    let _ix = canvas.width > canvas.height ? canvas.width : canvas.height;
    let _iy = canvas.width < canvas.height ? canvas.width : canvas.height;
    for (let i = 0; i < _iy / 200; i++) {
      for (let j = 0; j < _ix / 100; j++) {
        ctx.fillText("圈圈", i * 200, j * 100, _ix);
      }
    }
    canvas.style.transform = `scale(${ratio})`;
    canvas.style.marginTop = `-${(canvas.height * (1 - ratio)) / 2}px`;
    canvas.style.marginLeft = `-${(canvas.width * (1 - ratio)) / 2}px`;
    callback(canvas);
  };

  renderCanvas();

  return canvas;
}

export { createCanvas };
