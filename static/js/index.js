function present_data(data) {
    console.log('Got data: ', data);
    var bb = Backbone;

    // in case not parsed
    if (typeof(data) == 'string') {
        data = JSON.parse(data);
    }

// definition
    var NewsModel = bb.Model.extend({
        get: function (attribute) {
            var origin = bb.Model.prototype.get.apply(this, arguments);
            if (attribute == 'content') {
                if (location.href.indexOf('/jp/') > -1) {
                    return origin['jp'];
                } else {
                    return origin['en'];
                }
            } else {
                return origin;
            }
        },
        getYear: function () {
            var date = this.get('date');
            return date.split('.')[0];
        }
    });

    var NewsCollection = bb.Collection.extend({
        model: NewsModel,
        comparator: function (model) {
            var date = model.get('date');
            return -Date.parse(date);
        }
    });

    var NewsView = bb.View.extend({

        template: _.template($('#template-news-entry').html()),
        limit: 10, // you may want moorreee

        render: function () {
            console.log('Rendering...');
            this.collection.each(_.bind(function (d) {
                if (this.limit > 0) {
                    this.$el.append(this.template({data: d}));
                    --this.limit;
                }
            }, this));
            return this;
        }
    });
// instantiate view
    (new NewsView({collection: new NewsCollection(data), el: '#n_parts'})).render();
}

function init() {
    console.log('Initializing');

//    $.get('/api_man/page/news').done(function (data) {
        //present_data(data)
    //});
}
$(init);
