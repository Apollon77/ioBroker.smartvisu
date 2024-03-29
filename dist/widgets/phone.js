// ----- phone.list -----------------------------------------------------------
$.widget("sv.phone_list", $.sv.widget, {

	initSelector: 'div[data-widget="phone.list"]',

	options: {
		count: 10,
		"service-url": ''
	},
	
	_phoneErrorNotification: 0,

	_repeat: function() {
		var count = this.options.count;
		var element = this.element;
				
		$.ajax({
			dataType: "json",
			url: this.options['service-url'],
			context: this,
			beforeSend: function(jqXHR, settings) { jqXHR.svProcess = 'Phone List Widget'; },
			success: function (data) {
				var ret;
				var line = '';
				var sum = 1;

				for (var i in data) {
					ret = '<img class="icon" src="pics/phone/' + data[i].pic + '" alt="' + data[i].pic + '" />';
					ret += '<img class="dir" src="lib/phone/pics/' + data[i].dirpic + '" alt="' + data[i].dirpic + '" />';
					ret += '<h3>' + data[i].text + '&nbsp;</h3>';
					ret += '<p>' + data[i].number + '&nbsp;</p>';
					ret += '<span class="ui-li-count">' + data[i].date + '</span>';
					ret = '<a ' + (data[i].number ? 'href="callto://' + data[i].number : '') + '">' + ret + '</a>';

					line += '<li data-icon="false">' + ret + '</li>';
					if (sum++ == count)
						break;
				}
				element.children('ul').html(line).trigger('prepare').listview('refresh').trigger('redraw');
				
				if (this._phoneErrorNotification != 0){
					notify.remove(this._phoneErrorNotification);
					this._phoneErrorNotification = 0;
				}
			}
		})
		.fail(function(jqXHR, status, errorthrown){
			if (this._phoneErrorNotification == 0 || !notify.exists(this._phoneErrorNotification) )
				this._phoneErrorNotification = notify.json(jqXHR, status, errorthrown);
		});
	}

});


// ----- phone.missedlist -----------------------------------------------------
$.widget("sv.phone_missedlist", $.sv.widget, {

	initSelector: 'div[data-widget="phone.missedlist"]',

	options: {
		count: 3,
		"service-url": ''
	},
	
	_phoneErrorNotification: 0,

	_repeat: function() {
		var count = this.options.count;
		var element = this.element;
		
		$.ajax({
			dataType: "json",
			url: this.options['service-url'],
			context: this,
			beforeSend: function(jqXHR, settings) { jqXHR.svProcess = 'Phone Missedlist Widget'; },
			success: function (data) {
				var ret;
				var line = '';
				var sum = 1;

				for (var i in data) {
					if (data[i].dir == 0) {
						ret = '<img class="icon" src="pics/phone/' + data[i].pic + '" alt="' + data[i].pic + '" />';
						ret += '<img class="dir" src="lib/phone/pics/' + data[i].dirpic + '" alt="' + data[i].dirpic + '" />';
						ret += '<h3>' + data[i].text + '&nbsp;</h3>';
						ret += '<p>' + data[i].number + '&nbsp;</p>';
						ret += '<span class="ui-li-count">' + data[i].date + '</span>';
						ret = '<a ' + (data[i].number ? 'href="callto://' + data[i].number : '') + '">' + ret + '</a>';

						line += '<li data-icon="false">' + ret + '</li>';

						if (sum++ == count)
							break;
					}
				}
				element.children('ul').html(line).trigger('prepare').listview('refresh').trigger('redraw');
				
				if (this._phoneErrorNotification != 0){
						notify.remove(this._phoneErrorNotification);
						this._phoneErrorNotification = 0;
				}
			}
		})
		.fail(function(jqXHR, status, errorthrown){
			if (this._phoneErrorNotification == 0 || !notify.exists(this._phoneErrorNotification) )
				this._phoneErrorNotification = notify.json(jqXHR, status, errorthrown);
		});
	}
});
