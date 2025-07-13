import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TinyMceConfigService {

  constructor() { }

  getEditorInit(setLoadingDone: () => void): Record<string, any> {
    return {
      selector: 'textarea',
      language: 'pl',
      height: 700,
      plugins: [
        'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media', 'searchreplace',
        'table', 'visualblocks', 'wordcount',
      ],
      toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | ' +
        'addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist ' +
        'indent outdent | emoticons charmap | removeformat',
      tinycomments_mode: 'embedded',
      tinycomments_author: 'Author name',
      setup: (editor: any) => {
        editor.on('init', () => {
          setLoadingDone();
        });
      }
    };
  }
}