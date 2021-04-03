import { get } from 'svelte/store';
import { doc, textElem, canvas, pageNum, numPages, scale } from '../store.js';
import pdfjs from 'pdfjs-dist/build/pdf';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';
import { TextLayerBuilder, EventBus } from 'pdfjs-dist/web/pdf_viewer';
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export default class Reader {
  canvas: any;
  textElem: any;
  doc: any;
  svg: any;
  pageNum: number;
  numPages: any;
  pageRendering: Boolean;
  pageNumPending: any;
  scale: number;
  ctx: any;
  next: Function;
  prev: Function;
  open: Function;

  constructor() {
    this.canvas = null;
    this.textElem = get(textElem);
    this.doc = null;
    this.svg = null;
    this.pageNum = 1;
    this.numPages = null;
    this.pageRendering = false;
    this.pageNumPending = null;
    this.scale = 1;
    this.ctx = null;
    this.next = this.onNextPage;
    this.prev = this.onPrevPage;

    this.next = this.onNextPage.bind(this);
    this.prev = this.onPrevPage.bind(this);
    this.open = this.openFile.bind(this);
    this.zoomIn = this.zoomIn.bind(this);
    this.zoomOut = this.zoomOut.bind(this);
  }

  subscribe() {
    doc.subscribe((val) => (this.doc = val));
    canvas.subscribe((val) => (this.canvas = val));
    textElem.subscribe((val) => (this.textElem = val));
    numPages.subscribe((val) => (this.numPages = val));
    pageNum.subscribe((val) => (this.pageNum = val));
    scale.subscribe((val) => (this.scale = val));
  }

  init() {
    this.subscribe();
  }

  openFile(file) {
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);
    fileReader.onload = (e) => {
      let result = fileReader.result as ArrayBufferLike;
      const arrayDoc = new Uint8Array(result);

      pdfjs.getDocument(arrayDoc).promise.then((pdfDoc_) => {
        doc.update((val) => pdfDoc_);
        numPages.update((val) => pdfDoc_.numPages);
        pageNum.update((val) => 1);

        this.renderPage(this.pageNum);
      });
    };
  }

  renderPage(num) {
    if (this.doc) {
      this.pageRendering = true;

      this.doc.getPage(num).then((page) => {
        let viewport = page.getViewport({ scale: this.scale });
        // page.getTextContent().then(function (textContent) {
        //   // building SVG and adding that to the DOM
        //   const svg = buildSVG(viewport, textContent);
        //   console.log(svg);
        //   this.svg = svg;
        //   container.appendChild(svg);
        // });
        this.canvas.height = viewport.height;
        this.canvas.width = viewport.width;
        this.ctx = this.canvas.getContext('2d');

        page
          .render({
            canvasContext: this.ctx,
            viewport: viewport,
          })
          .promise.then(() => {
            this.pageRendering = false;
            if (this.pageNumPending !== null) {
              this.renderPage(this.pageNumPending);
              this.pageNumPending = null;
            }
            return page.getTextContent();
          })
          .then((textContent) => {
            let canvasOffset = this.canvas.getBoundingClientRect();
            this.textElem.innerHTML = '';
            this.textElem.setAttribute(
              'style',
              `left: ${canvasOffset.left}px; top: ${canvasOffset.top}px; height: ${viewport.height}px; width: ${viewport.width}px;`
            );
            var textLayer = new TextLayerBuilder({
              textLayerDiv: this.textElem,
              eventBus: new EventBus(),
              pageIndex: this.pageNum,
              viewport: viewport,
            });
            textLayer.setTextContent(textContent);
            textLayer.render();
          });
      });

      this.pageNum = num;
    }
  }

  getNumPages() {
    return this.numPages;
  }

  queueRenderPage(num) {
    if (this.pageRendering) {
      this.pageNumPending = num;
    } else {
      this.renderPage(num);
      pageNum.update((n) => num);
    }
  }

  onPrevPage() {
    if (this.pageNum <= 1) {
      return;
    }
    this.pageNum--;
    this.queueRenderPage(this.pageNum);
  }

  onNextPage() {
    if (this.pageNum >= this.doc.numPages) {
      return;
    }
    this.pageNum++;
    this.queueRenderPage(this.pageNum);
  }

  zoomIn() {
    if (this.scale < 2) {
      this.scale += 0.1;
      scale.update((n) => Number(n) + 0.1);
      this.renderPage(this.pageNum);
    }
  }

  zoomOut() {
    if (this.scale > 0.8) {
      this.scale -= 0.1;
      scale.update((n) => Number(n) - 0.1);
      this.renderPage(this.pageNum);
    }
  }

  // function buildSVG(viewport, textContent) {
  //   // Building SVG with size of the viewport (for simplicity)
  //   const svg = document.createElementNS(
  //     'http://www.w3.org/2000/svg',
  //     'svg:svg'
  //   );
  //   svg.setAttribute('width', viewport.width + 'px');
  //   svg.setAttribute('height', viewport.height + 'px');
  //   // items are transformed to have 1px font size
  //   svg.setAttribute('font-size', 1);

  //   // processing all items
  //   textContent.items.forEach(function (textItem) {
  //     // we have to take in account viewport transform, which includes scale,
  //     // rotation and Y-axis flip, and not forgetting to flip text.
  //     const tx = pdfjs.Util.transform(
  //       pdfjs.Util.transform(viewport.transform, textItem.transform),
  //       [1, 0, 0, -1, 0, 0]
  //     );
  //     const style = textContent.styles[textItem.fontName];
  //     // adding text element
  //     const text = document.createElementNS(
  //       'http://www.w3.org/2000/svg',
  //       'svg:text'
  //     );
  //     text.setAttribute('transform', 'matrix(' + tx.join(' ') + ')');
  //     text.textContent = textItem.str;
  //     svg.appendChild(text);
  //   });
  //   return svg;
  // }
}
