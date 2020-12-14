$(function() {
  
  function sendFile(file, editor) {
    data = new FormData();
    data.append("file", file);
    var request = $.ajax({
        data: data,
        type: "POST",
        url: "/files/upload",
        cache: false,
        contentType: false,
        processData: false,
        success: function(res) {
          $(editor).summernote('editor.insertImage', res.url);
          $('.note-image-input').val('')
        }
    });
  }
  
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-primary btn-sm mr-1 ml-1',
      cancelButton: 'btn btn-secondary btn-sm mr-1 ml-1'
    },
    buttonsStyling: false
  })

  if ($(".summernote")[0]) {
    $('.summernote').summernote({
      minHeight: 300,
      toolbar: [
          ['style', ['bold', 'italic', 'underline', 'clear']],
          ['font', ['strikethrough', 'superscript', 'subscript']],
          ['fontsize', ['fontsize']],
          ['color', ['color']],
          ['para', ['ul', 'ol', 'paragraph']],
          ['height', ['height']],
          ['insert', ['picture', 'link', 'video', 'table', 'hr']],
          ['view', ['fullscreen', 'codeview']],
      ],
      fontNames: ['Roboto'],
      callbacks: {
          onImageUpload: function(files) {
              sendFile(files[0], this);
          },
          onPaste: function (e) {
            var bufferText = ((e.originalEvent || e).clipboardData || window.clipboardData).getData('text/html');
            e.preventDefault();
            var div = $('<div />');
            div.append(bufferText);
            div.find('*').removeAttr('style');
            setTimeout(function () {
              document.execCommand('insertHtml', false, div.html());
            }, 10);
          }
      }
    });

    $('.summernote').summernote('fontName', 'Roboto');
  }


  $('.delete-item-btn').on('click', function() {
    var self = this
    swalWithBootstrapButtons.fire({
      title: 'Bạn có chắc?',
      text: "Bạn muốn xóa: " + $(self).data('title'),
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Không xóa'
    }).then(function(result) {
      if (result.value) {
        if ($(self).data('path')) {
          window.location = $(self).data('path') + $(self).data('id') + '/delete'
        } else {
          window.location = '/admin/'+ $(self).data('scope') +'/' + $(self).data('id') + '/delete'
        }
      }
    })
  })

})