/**
 * Created by lc on 14-8-22.
 */
var news_template = [
    '<div id="N_<%=data.get(\'id\')%>" class="each">',
    '<dl>',
    '<dt class="date"><%=data.get(\'date\')%></dt>',
    '<dt class="title"><%=data.get(\'content\')%></dt>',
    '<div class="clear"></div>',
    '</dl>',
    '</div>'
].join('\n');
var year_menu_entry_template =
    '<li class="toTop3"><a href="#N<%=year%>"><%=year%></a></li>';

function present_data(data){
    console.log('Got data: ', data);
    var bb = Backbone;

    // in case not parsed
    if(typeof(data) == 'string'){
        data = JSON.parse(data);
    }

    // definition
    var NewsModel = bb.Model.extend({
        get: function(attribute){
            var origin = bb.Model.prototype.get.apply(this, arguments);
            if(attribute == 'content'){
                if(location.href.indexOf('/jp/')>-1){
                    return origin['jp'];
                } else {
                    return origin['en'];
                }
            } else {
                return origin;
            }
        },
        getYear: function(){
            var date = this.get('date');
            return date.split('.')[0];
        }
    });

    var NewsCollection = bb.Collection.extend({
        model: NewsModel,
        comparator: function (model){
            var date = model.get('date');
            return -Date.parse(date);
        }
    });

    // the global holder
    var NewsHolderView = bb.View.extend({
        //actually this is not a view. just using a wrapping
        template_year: _.template(year_menu_entry_template),
        template: _.template($('#template-year-holder-entry').html()),

        render: function(){
            console.log('Rendering all news...', this.collection);
            for(var year = 2030; year > 2010; --year){
                // this invalidates in year 2030, hmmm
                var filtered = this.collection.filter(function(m){
                    return m.getYear() == year;
                });
                if(filtered.length){
                    //insert menu
                    $('.news-menu').prepend(this.template_year({year:year}));
                    //insert content
                    this.$el = $(this.template({year:year}));
                    var year_view = new NewsView({collection: new NewsCollection(filtered), tagName:'div'});
                    this.$el.find('.news-entry-holder').html(year_view.render().$el);
                    $('.years-holder').append(this.$el);
                }
            }
        }
    });

    // the holder for 1 year
    var NewsView = bb.View.extend({

        template : _.template(news_template),

        render : function(){
            console.log('Rendering one year...', this.collection);
            this.collection.each(_.bind(function(d){
                this.$el.append(this.template({data:d}));
            }, this));
            return this;
        }
    });
    // instantiate view
    (new NewsHolderView({collection: new NewsCollection(data)})).render();
}

function init(){
    console.log('Initializing');

    // $.get('/api_man/page/news').done(function(data){present_data(data)});
}

$(init);
