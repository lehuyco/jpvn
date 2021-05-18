$(function () {
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-primary mr-1 ml-1',
            cancelButton: 'btn btn-secondary mr-1 ml-1',
        },
        buttonsStyling: false,
    })

    // $('.datepicker').datepicker({
    //   format: 'dd/mm/yyyy'
    // });

    // $('.btn-delete-item').on('click', function() {
    //   var self = this
    //   swalWithBootstrapButtons.fire({
    //     title: 'Bạn có chắc?',
    //     text: "Bạn muốn xóa: " + $(self).data('title'),
    //     type: 'warning',
    //     showCancelButton: true,
    //     confirmButtonText: 'Xóa',
    //     cancelButtonText: 'Không xóa'
    //   }).then(function(result) {
    //     if (result.value) {
    //       window.location = '/'+ $(self).data('scope') +'/' + $(self).data('id') + '/delete'
    //     }
    //   })
    // })

    $('.btn-apply').on('click', function () {
        console.log('Apply Click')
        var self = this
        $('#applyModal #jobId').val($(self).data('id'))
        $('#applyModal .modal-title').text($(self).data('title'))
        $('#applyModal ').modal('show')
    })

    $('#applyForm').submit(function (event) {
        event.preventDefault()
        // $("#status").empty().text("File is uploading...");
        $(this).ajaxSubmit({
            error: function (response) {
                console.log(response)
                if (response.responseJSON && response.responseJSON.message) {
                    $('#status').empty().text(response.responseJSON.message)
                    $('#status').addClass('alert alert-danger')
                }
            },
            success: function (response) {
                $('#applyModal ').modal('hide')
                swalWithBootstrapButtons.fire(
                    'Thành công',
                    'Cảm ơn bạn đã nộp hồ sơ ứng tuyển, Công ty sẽ liên hệ bạn trong thời gian sớm nhất. Trân trọng!',
                    'success'
                )
                console.log(response)
            },
        })
        return false
    })

    $('#contactForm').submit(function (event) {
        event.preventDefault()
        $(this).ajaxSubmit({
            error: function (response) {
                console.log(response)
                if (response.responseJSON && response.responseJSON.message) {
                    $('#status').empty().text(response.responseJSON.message)
                    $('#status').addClass('alert alert-danger')
                }
            },
            success: function (response) {
                console.log(response)
                swalWithBootstrapButtons
                    .fire(
                        'Thành công',
                        'Cảm ơn bạn đã gửi yêu cầu, Công ty sẽ liên hệ bạn trong thời gian sớm nhất. Trân trọng!',
                        'success'
                    )
                    .then(function (result) {
                        location.reload()
                    })
            },
        })
        return false
    })
})
