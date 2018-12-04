if (window.matchMedia('(max-width: 640px)').matches) {
	$(function(){
		//$('.acordion_tree').css('display', 'none');
		
		$('.trigger').on('click', function(){
			if ($('+.acordion_tree', this).css('display') == 'none') {
				$(this).addClass('active');
				$('+.acordion_tree', this).slideDown('normal');
			} else {
				$(this).removeClass('active');
				$('+.acordion_tree', this).slideUp('normal');
			}
		});
	});
}
