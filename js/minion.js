function addCharaData(chara_id) {
	return $.ajax({
		url: '/php/ldst_access.php?url='+LODESTONE_URL+'/character/'+chara_id,
		type: 'GET',
		dataType: 'json',
		loadingHide: function(res){}
	})
	.then(
		function(res){
			$content = $(res.data);

			var key_number = 0;
			$('.list').append('<li id="break_'+chara_id+'" class="break list_item" data-sortkey="'+(key_number++)+'"></li>');
			$('.list').append('<li id="delete_'+chara_id+'" class="delete list_item" data-sortkey="'+(key_number++)+'"><a href="javascript:void(0);" class="delete_btn button" data-id="'+chara_id+'">一覧から消す</a></li>');
			$('.list').append('<li id="chara_face_'+chara_id+'" class="chara_face list_item" data-sortkey="'+(key_number++)+'"></li><li id="chara_name_'+chara_id+'" class="chara_name list_item" data-sortkey="'+(key_number++)+'"></li>');

			var user_face_image = $content.find('.frame__chara__face').html();
			var user_name_text  = $content.find('.frame__chara__name').text();
			var user_world_text = $content.find('.frame__chara__world').text();

			$('#chara_face_'+chara_id).append(user_face_image);
			$('#chara_name_'+chara_id).append('<em>'+user_name_text+'</em>');
			$('#chara_name_'+chara_id).append('<span class="character_world">'+user_world_text+'</span>');

			addListItems($content, chara_id, key_number);

			$content.find('script').remove();
			var chara_data = '<li id="ldst_main_'+chara_id+'" class="ldst_main" data-sortkey="">'+$content.find('.ldst__main').html()+'</li>';
			setDeleteButtonRightPosition()
			addCharacterData(chara_data);
		},
		function(XMLHttpRequest, textStatus, errorThrown) {
			alert('キャラクターの情報が取得できませんでした。');
			console.log("XMLHttpRequest: " + XMLHttpRequest.status);
			console.log("textStatus: " + textStatus);
			console.log("errorThrown: " + errorThrown.message);
		}
	);
}

function addListItems($content, chara_id, key_number) {
	var $items = $('#minion .items').find('input[readonly="readonly"]');
	var tooltips = new Array();
	var minions = new Array();
	$items.each(function(index){
		console.log(index);
		console.log($(this).val());
		if ($(this).val().indexOf('job:') === 0) {
			var job_name;
			var job_names = $(this).val().split(':')[1].split(' / ');
			var $job_name;
			for (var i = 0; i < job_names.length; i++) {
				var $job = $content.find('.character__job__name:contains("'+job_names[i]+'")');
				if ($job.length) {
					job_name = job_names[i];
					$job_name = $job;
				}
			}
			var $job_icon = $job_name.siblings('.character__job__icon');
			var $job_level = $job_name.siblings('.character__job__level');
			tooltips.push(job_name);
			minions.push($job_icon);
			tooltips.push('');
			minions.push($job_level);
		} else {
			tooltips.push($(this).val());
			minions.push($content.find('.character__item_icon[data-tooltip="'+$(this).val()+'"]'));
		}
	});

    for (var i = 0; i < minions.length; i++) {
        var $minion = $(minions[i]).clone();
        var item_type = 'mount_image icon';
        if ($minion.attr('class') === 'character__job__icon') {
            item_type = 'job_icon icon';
        }
        if ($minion.attr('class') === 'character__job__level') {
            item_type = 'job_level';
        }
        $('.list').append('<li id="mount'+i+'_'+chara_id+'" class="'+item_type+' list_item" data-sortkey="'+(key_number++)+'"></li>');
        if (tooltips[i] !== '') {
            $('#mount'+i+'_'+chara_id).append('<span class="tooltip"><span class="text">'+tooltips[i]+'</span></span>');
        }
        $minion.appendTo('#mount'+i+'_'+chara_id);
    }
}
