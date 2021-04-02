import {
  doc,
  pageContent,
  canvas,
  pageNum,
  numPages,
  scale,
} from '../store.js';
import pdfjs from 'pdfjs-dist/build/pdf';
import { TextLayerBuilder, EventBus } from 'pdfjs-dist/web/pdf_viewer';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export default class Reader {
  canvas: any;
  doc: any;
  svg: any;
  pageNum: number;
  numPages: any;
  pageContent: Array<string>;
  pageRendering: Boolean;
  pageNumPending: any;
  scale: number;
  ctx: any;
  next: Function;
  prev: Function;

  constructor() {
    this.canvas = null;
    this.doc = null;
    this.svg = null;
    this.pageNum = 1;
    this.numPages = null;
    this.pageRendering = false;
    this.pageContent = [];
    this.pageNumPending = null;
    this.scale = 1;
    this.ctx = null;
    this.next = this.onNextPage;
    this.prev = this.onPrevPage;

    this.next = this.onNextPage.bind(this);
    this.prev = this.onPrevPage.bind(this);
    this.zoomIn = this.zoomIn.bind(this);
    this.zoomOut = this.zoomOut.bind(this);
  }

  subscribe() {
    doc.subscribe((val) => (this.doc = val));
    canvas.subscribe((val) => (this.canvas = val));
    numPages.subscribe((val) => (this.numPages = val));
    pageNum.subscribe((val) => (this.pageNum = val));
    scale.subscribe((val) => (this.scale = val));
    pageContent.subscribe((val) => (this.pageContent = val));
  }

  init() {
    this.subscribe();
    pdfjs.getDocument('/doc.pdf').promise.then((pdfDoc_) => {
      doc.update((val) => pdfDoc_);
      numPages.update((val) => pdfDoc_.numPages);
      pageNum.update((val) => 1);
      // this.doc = pdfDoc_;
      // this.numPages = pdfDoc_.numPages;
      // store.set({
      //   ...store,
      //   pageNum: 1,
      //   numPages: pdfDoc_.numPages,
      //   doc: pdfDoc_,
      // });

      this.renderPage(this.pageNum);
    });
  }

  renderPage(num) {
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
          const tempContentArray = [];
          textContent.items.forEach((item) => {
            tempContentArray.push(item.str);
          });
          pageContent.update((val) => tempContentArray);
          // console.log(textContent);
          // textContainer.innerHTML = '';
          // textContent.items.forEach((item) => {
          //   const itemElement = document.createElement('span');
          //   itemElement.setAttribute('data-height', item.height);
          //   itemElement.setAttribute('data-width', item.width);
          //   itemElement.setAttribute(
          //     'data-transform',
          //     item.transform.toString()
          //   );
          //   itemElement.innerHTML = item.str;
          //   textContainer.appendChild(itemElement);
          // });
          // var textLayer = new TextLayerBuilder({
          //   textLayerDiv: textContainer,
          //   eventBus: new EventBus(),
          //   pageIndex: page.pageIndex,
          //   viewport: viewport,
          // });
          // textLayer.setTextContent(textContent);
          // textLayer.render();
        });
    });

    this.pageNum = num;
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
      scale.update((n) => n + 0.1);
      this.renderPage(this.pageNum);
    }
  }

  zoomOut() {
    if (this.scale > 0.8) {
      this.scale -= 0.1;
      scale.update((n) => n - 0.1);
      this.renderPage(this.pageNum);
    }
  }
}
