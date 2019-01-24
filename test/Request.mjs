/*
 Copyright 2017 Google Inc. All Rights Reserved.
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
     http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.

Modifications copyright (C) 2019 <Tamas Piros / Cloudinary>
*/

import '@babel/polyfill';
import Blob from './Blob.mjs'
import Headers from './Headers.mjs'

class Request {
  constructor(url, options = {}) {
    if (url instanceof Request) {
      options = url;
      url = options.url;
    }

    if (!url) {
      throw new TypeError(`Invalid url: ${url}`);
    }

    this.url = url;
    this.method = options.method || 'GET';
    this.mode = options.mode || 'cors';
    // See https://fetch.spec.whatwg.org/#concept-request-credentials-mode
    this.credentials = options.credentials || (this.mode === 'navigate' ?
      'include' : 'omit');
    this.headers = new Headers(options.headers);

    this._body = new Blob('body' in options ? [options.body] : []);
  }

  clone() {
    if (this.bodyUsed) {
      throw new TypeError(`Failed to execute 'clone' on 'Request': ` +
          `Request body is already used`);
    } else {
      return new Request(this.url, Object.assign({body: this._body}, this));
    }
  }

  async blob() {
    if (this.bodyUsed) {
      throw new TypeError('Already read');
    } else {
      this.bodyUsed = true;
      return this._body;
    }
  }

  async text() {
    if (this.bodyUsed) {
      throw new TypeError('Already read');
    } else {
      this.bodyUsed = true;
      // Limitation: this assumes the stored Blob is text-based.
      return this._body._text;
    }
  }
}

export default Request;