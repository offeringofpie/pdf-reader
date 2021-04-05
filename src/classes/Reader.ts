import { get } from 'svelte/store';
import {
  doc,
  textElem,
  pageContent,
  canvas,
  pageNum,
  numPages,
  scale,
} from '../store.js';
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
    this.zoom = this.zoom.bind(this);
    this.zoomIn = this.zoomIn.bind(this);
    this.zoomOut = this.zoomOut.bind(this);
    this.goToPage = this.goToPage.bind(this);
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
            pageContent.update((val) =>
              textContent.items.length
                ? textContent.items.map((item) => item.str)
                : null
            );
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

  goToPage(ev) {
    let num = ev.target[0].value;
    if (num < 1) {
      this.pageNum = 1;
    } else if (num > this.doc.numPages) {
      this.pageNum = this.doc.numPages;
    } else {
      this.pageNum = parseInt(num);
    }
    this.queueRenderPage(this.pageNum);
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

  zoom(val) {
    this.scale = val;
    scale.set(val);
    this.queueRenderPage(this.pageNum);
  }

  zoomIn() {
    if (this.scale <= 3) {
      this.scale += 0.1;
      scale.update((n) => Number(n) + 0.1);
      this.queueRenderPage(this.pageNum);
    }
  }

  zoomOut() {
    if (this.scale >= 1) {
      this.scale -= 0.1;
      scale.update((n) => Number(n) - 0.1);
      this.queueRenderPage(this.pageNum);
    }
  }
}
