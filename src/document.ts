import { NonElementParentNode } from "./non-element-parent-node.js";

export abstract class Document extends NonElementParentNode {
	//// Dom
	contentType: string;
	documentURI: string;
	defaultView?: Window;
	_domImpl?: DOMImplementationA;

	protected constructor(contentType?: string) {
		super();
		this.ownerDocument = this;
		this.documentURI = "about:blank";
		this.contentType =
			contentType && contentType !== "" ? contentType : "application/xml";
	}

	get URL() {
		return this.documentURI;
	}
	get compatMode() {
		return "CSS1Compat";
	}
	get location() {
		return null;
	}
	get characterSet() {
		return "UTF-8";
	}

	get charset() {
		return this.characterSet;
	}
	get inputEncoding() {
		return this.characterSet;
	}

	get nodeType() {
		return 9;
	}
	get nodeName() {
		return "#document";
	}
	get documentElement() {
		return this.firstElementChild;
	}
	get textContent() {
		return null;
	}
	set textContent(text: string | null) {}
	get doctype() {
		const { firstChild } = this;
		for (let cur = firstChild; cur; cur = cur.nextSibling) {
			if (cur.nodeType === 10) {
				return cur as DocumentType;
			}
		}
		// return this.insertBefore(
		// 	new DocumentType("html"),
		// 	firstChild
		// ) as DocumentType;
		return null;
	}
	get body() {
		for (const cur of this.getElementsByTagName("body")) {
			return cur as Element;
		}
		return null;
	}
	get title() {
		for (const cur of this.getElementsByTagName("title")) {
			return cur.textContent;
		}
		return "";
	}

	get implementation() {
		const { _domImpl } = this;
		return _domImpl || (this._domImpl = new DOMImplementationA(this));
	}

	lookupNamespaceURI(prefix: string | null): string | null {
		const { documentElement: node } = this;
		return node && node.lookupNamespaceURI(prefix);
	}

	createElement(localName: string) {
		const node = newElement(this.contentType, localName);
		node.ownerDocument = this;
		return node;
	}

	createElementNS(
		ns: string | null | undefined,
		qualifiedName: string
	): Element {
		const node = newElement(this.contentType, qualifiedName, ns);
		node.ownerDocument = this;
		return node;
	}
	createTextNode(text: string) {
		const node = new Text(text);
		node.ownerDocument = this;
		return node;
	}
	createComment(text: string) {
		const node = new Comment(text);
		node.ownerDocument = this;
		return node;
	}
	createProcessingInstruction(target: string, data: string) {
		const node = new ProcessingInstruction(target, data);
		node.ownerDocument = this;
		return node;
	}
	createCDATASection(text: string) {
		if (this.isHTML) {
			throw new Error(`NotSupportedError`);
		}
		const node = new CDATASection(text);
		node.ownerDocument = this;
		return node;
	}
	createDocumentFragment() {
		const node = new DocumentFragment();
		node.ownerDocument = this;
		return node;
	}
	createAttribute(name: string) {
		const node = Attr.create(name + "", null, this.contentType);
		node.ownerDocument = this;
		return node;
	}
	createAttributeNS(ns: string | null | undefined, qualifiedName: string) {
		const node = Attr.create(qualifiedName, ns, this.contentType);
		node.ownerDocument = this;
		return node;
	}

	createRange() {
		return {};
	}

	static fromNS(ns?: string) {
		switch (ns) {
			case "text/html":
			case "http://www.w3.org/1999/xhtml":
				return new HTMLDocument();
			case "image/svg+xml":
			case "http://www.w3.org/2000/svg":
				return new SVGDocument();
			default:
				return new XMLDocument();
		}
	}

	get isHTML() {
		return false;
	}
	get isSVG() {
		return false;
	}

	cloneNode(deep?: boolean) {
		const { contentType, defaultView, documentURI } = this;
		const node = new (this.constructor as any)();

		if (contentType) node.contentType = contentType;
		if (defaultView) node.defaultView = defaultView;
		if (documentURI) node.documentURI = documentURI;
		// if (characterSet) node.characterSet = characterSet;
		if (deep) {
			const end = node[END];
			const fin = this[END];
			let cur: Node = this[NEXT] || fin;
			for (; cur != fin; cur = cur.endNode[NEXT] || fin) {
				switch (cur.nodeType) {
					case 1: // ELEMENT_NODE
					case 7: // PROCESSING_INSTRUCTION_NODE
					case 8: // COMMENT_NODE
					case 10: // DOCUMENT_TYPE_NODE
						cur.cloneNode()._attach(end[PREV] || node, end, node);
						break;
					case 3: // TEXT_NODE
					case 4: // CDATA_SECTION_NODE
					case 2: // ATTRIBUTE_NODE
					case 9: // DOCUMENT_NODE
					case 11: // DOCUMENT_FRAGMENT_NODE
					case -1:
						throw new Error(`Unexpected ${cur.nodeType}`);
						break;
				}
			}
		}
		return node;
	}
	adoptNode(node: Node) {
		let { startNode: cur, endNode: end } = node;
		do {
			cur.ownerDocument = this;
		} while (cur !== end && (cur = cur[NEXT] || end));
		return node;
	}
	importNode(node: Node, deep = false) {
		return this.adoptNode(node.cloneNode(deep));
	}
	*_toNodes(nodes: Array<string | ChildNode>): IterableIterator<ChildNode> {
		for (const [i, node] of nodes.entries()) {
			if (typeof node === "string" || !node) {
				yield this.createTextNode(node + "") as ChildNode;
			} else
				switch (node.nodeType) {
					case undefined:
						throw new Error(`Unexpected ${node}`);
					case 11:
						{
							if (this.firstElementChild) {
								if ((node as ParentNode).firstElementChild) {
									throw new Error(`HierarchyRequestError`);
								}
							} else {
								if (
									(node as ParentNode).firstElementChild
										?.nextElementSibling
								) {
									throw new Error(`HierarchyRequestError`);
								}
							}
							for (const cur of (node as ParentNode).childNodes) {
								yield cur;
							}
							yield node;
						}
						break;
					case 10: {
						// DOCUMENT_TYPE_NODE
						if (this.doctype) {
							throw new Error(`HierarchyRequestError`);
						}
						yield node;
						break;
					}
					case 1: {
						let j = i;
						for (const C = nodes.length; ++j < C; ) {
							const n = nodes[j];
							if (
								n &&
								typeof n !== "string" &&
								n.nodeType === 1
							) {
								throw new Error(`HierarchyRequestError`);
							}
						}
					}

					default:
						yield node;
				}
		}
	}
}

function validateAndExtract(
	namespace: string | null,
	qualifiedName: string
): [string | null, string | null, string] {
	let prefix = null,
		localName = qualifiedName,
		pos = qualifiedName.indexOf(":");

	const ns = namespace === "" || !namespace ? null : namespace;

	if (pos >= 0) {
		prefix = qualifiedName.substring(0, pos);
		localName = qualifiedName.substring(pos + 1);
	}
	if (
		(prefix !== null && ns === null) ||
		(prefix === "xml" && ns !== XML) ||
		((prefix === "xmlns" || qualifiedName === "xmlns") && ns !== XMLNS) ||
		(ns === XMLNS && !(prefix === "xmlns" || qualifiedName === "xmlns"))
	) {
		throw new Error("NamespaceError");
	}

	return [ns, prefix, localName];
}

export class XMLDocument extends Document {
	constructor(mimeType: string = "application/xml") {
		super(mimeType);
	}
}

export class HTMLDocument extends Document {
	constructor() {
		super("text/html");
	}
	get isHTML() {
		return true;
	}
	static setup(titleText?: string) {
		const d = new HTMLDocument();
		const root = d.createElement("html");
		const head = d.createElement("head");
		const title = d.createElement("title");
		d.appendChild(new DocumentType("html"));
		title.appendChild(d.createTextNode(titleText || ""));
		head.appendChild(title);
		root.appendChild(head);
		root.appendChild(d.createElement("body"));
		d.appendChild(root);
		return d;
	}
}

export class SVGDocument extends Document {
	constructor() {
		super("image/svg+xml");
	}
	get isSVG() {
		return true;
	}
}

export class DOMImplementationA extends DOMImplementation {
	ownerDocument: Document;
	constructor(ownerDocument: Document) {
		super();
		this.ownerDocument = ownerDocument;
	}
	createDocumentType(
		qualifiedName: string,
		publicId: string,
		systemId: string
	) {
		const node = super.createDocumentType(
			qualifiedName,
			publicId,
			systemId
		);
		node.ownerDocument = this.ownerDocument;
		return node;
	}
	createDocument(
		namespace?: string,
		qualifiedName?: string,
		doctype?: DocumentType
	) {
		var doc = Document.fromNS(namespace);
		if (doctype) {
			// if (doctype.ownerDocument) {
			// 	throw new Error(
			// 		"the object is in the wrong Document, a call to importNode is required"
			// 	);
			// }
			doctype.ownerDocument = doc;
			doc.appendChild(doctype);
		}
		if (qualifiedName) {
			doc.appendChild(
				doc.createElementNS(namespace || null, qualifiedName)
			);
		}
		return doc;
	}
	createHTMLDocument(titleText = "") {
		return HTMLDocument.setup(titleText);
	}
}

import { XMLNS, XML } from "./namespace.js";
import { ChildNode } from "./child-node.js";
import { EndNode, ParentNode } from "./parent-node.js";
import { Element } from "./element.js";
import { newElement } from "./elements.js";
import { Attr } from "./attr.js";
import {
	Comment,
	Text,
	CDATASection,
	ProcessingInstruction,
} from "./character-data.js";
import { DocumentFragment } from "./document-fragment.js";
import { DOMImplementation } from "./dom-implementation.js";
import { Window } from "./window.js";
import { DocumentType } from "./document-type.js";
import { NEXT, PREV, END, Node } from "./node.js";
