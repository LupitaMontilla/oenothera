$(function() {
	$('#freecompany').on('click', '.search_btn', function(){
		var freecompany_id = $('#freecompany_id').val();
		if (!freecompany_id) {
			alert('フリーカンパニーのID、またはURLを入力してください。');
			return false;
		}
		if (isNaN(freecompany_id)) {
			var index = freecompany_id.indexOf('/lodestone/freecompany/');
			var freecompany_path = freecompany_id.slice(index);
			freecompany_id = freecompany_path.split('/')[3];
		}
		if ($('#freecompany_name').attr('data-id') == freecompany_id) {
			alert('現在表示しているフリーカンパニーです。');
			return false;
		}
		var chara_id_list = [];
		$.when(
			$.ajax({
				url: '/php/ldst_access.php?url='+LODESTONE_URL+'/freecompany/'+freecompany_id+'/member/',
				type: 'GET',
				dataType: 'json',
			})
			.then(
				function(res){
					if (!$('.list:empty')) {
						if (($('#freecompany_name').attr('data-id') !=null || $('#freecompany_name').attr('data-id') !=null) && !confirm('現在の一覧を消去してからフリーカンパニーを読み込みますがよろしいですか？')) {
							return false;
						}
					}
					resetList();
					
					$content = $(res.data);
					var freecompany_name = $content.find('.entry__freecompany__name').text();
					$('#freecompany_name').text(freecompany_name);
					$('#freecompany_name').attr('data-id', freecompany_id);
					
					$content.find('.entry__bg').each(function(index){
						href = $(this).attr('href');
						chara_id = href.split('/')[3];
						chara_id_list.push(chara_id);
					});
				},
				function(XMLHttpRequest, textStatus, errorThrown) {
					alert('フリーカンパニーの情報が取得できませんでした。');
					console.log("XMLHttpRequest: " + XMLHttpRequest.status);
					console.log("textStatus: " + textStatus);
					console.log("errorThrown: " + errorThrown.message);
				}
			)
		).done(function(){
			for (var i = 0; i < chara_id_list.length; i++) {
				addCharaData(chara_id_list[i]);
			}
		});
	});
	
	$('#linkshell').on('click', '.search_btn', function(){
		var linkshell_id = $('#linkshell_id').val();
		if (!linkshell_id) {
			alert('リンクシェルのID、またはURLを入力してください。');
			return false;
		}
		if (isNaN(linkshell_id)) {
			var index = linkshell_id.indexOf('/lodestone/linkshell/');
			var linkshell_path = linkshell_id.slice(index);
			linkshell_id = linkshell_path.split('/')[3];
		}
		if ($('#linkshell_name').attr('data-id') == linkshell_id) {
			alert('現在表示しているリンクシェルです。');
			return false;
		}
		var chara_id_list = [];
		$.when(
			$.ajax({
				url: '/php/ldst_access.php?url='+LODESTONE_URL+'/linkshell/'+linkshell_id,
				type: 'GET',
				dataType: 'json'
			})
			.then(
				function(res){
					if (!$('.list:empty')) {
						if (($('#freecompany_name').attr('data-id') !=null || $('#freecompany_name').attr('data-id') !=null) && !confirm('現在の一覧を消去してからリンクシェルを読み込みますがよろしいですか？')) {
							return false;
						}
					}
					resetList();
					
					$content = $(res.data);
					var linkshell_name = $content.find('.heading__linkshell__name').text();
					$('#linkshell_name').text(linkshell_name);
					$('#linkshell_name').attr('data-id', linkshell_id);
					$('#linkshell .icon').append($content.find('.heading__linkshell__icon').html());
					
					$content.find('.entry__link').each(function(index){
						href = $(this).attr('href');
						chara_id = href.split('/')[3];
						chara_id_list.push(chara_id);
					});
				},
				function(XMLHttpRequest, textStatus, errorThrown) {
					alert('リンクシェルの情報が取得できませんでした。');
					console.log("XMLHttpRequest: " + XMLHttpRequest.status);
					console.log("textStatus: " + textStatus);
					console.log("errorThrown: " + errorThrown.message);
				}
			)
		).done(function(){
			for (var i = 0; i < chara_id_list.length; i++) {
				addCharaData(chara_id_list[i]);
			}
		});
	});

	$('#character').on('click', '.search_btn', function(){
		chara_id = $(this).prev().val();
		if (!chara_id) {
			alert('キャラクターのID、またはURLを入力してください。');
			return false;
		}
		if (isNaN(chara_id)) {
			var index = chara_id.indexOf('/lodestone/character/');
			var chara_path = chara_id.slice(index);
			chara_id = chara_path.split('/')[3];
		}
        if (document.getElementById('chara_name_'+chara_id) != null) {
            alert('すでに一覧に表示しているキャラクターです。');
            return false;
        }
		addCharaData(chara_id);
	});
	
	$('#reset').on('click', '.reset_btn', function(){
		if (confirm('現在の一覧を消去してよろしいですか？')) {
			resetList();
		}
	});
	
	$('#mount_list').on('click', '.list .delete_btn', function(){
		if (!$('#delete_confirm').prop('checked') || confirm('選択したキャラクターを一覧から削除しますか？')) {
			chara_id = $(this).attr('data-id');
			$('#break_'+chara_id).remove();
			$('#chara_face_'+chara_id).remove();
			$('#chara_name_'+chara_id).remove();
			for (var i = 0; i < 20; i++) {
				$('#mount'+i+'_'+chara_id).remove();
			}
			$(this).remove();
		}
	});
});

function resetList() {
	$('.list').empty();
	$('#freecompany_name').empty();
    $('#freecompany_name').attr('data-id', '');
	$('#linkshell_name').empty();
	$('#linkshell .icon').empty();
    $('#linkshell_name').attr('data-id', '');
}
