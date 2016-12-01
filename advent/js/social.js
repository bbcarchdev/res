eunction Social($elt) {
  this.$elt = $elt;
  this.ps = null;
  this._id_cache = {};
}

var __show = true;

$.extend(Social.prototype, (function() {

  var Renderer = function(canvas, click) {
    var canvas = $(canvas).get(0)
    var ctx = canvas.getContext("2d");
    var textShadow = false;
    var ps

    var that = {
      init: function(system) {
        ps = system;
        ps.screenSize(canvas.width, canvas.height);
        ps.screenPadding(80);
        that.initMouseHandling();
      },

      redraw: function() {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ps.eachEdge(function(edge, pt1, pt2) {
          ctx.strokeStyle = edge.data.color;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(pt1.x, pt1.y);
          ctx.lineTo(pt2.x, pt2.y);
          ctx.stroke();
        })

        ps.eachNode(function(node, pt) {
          var w = node.data.radius;
          ctx.fillStyle = node.data.color;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, w, 0, 2 * Math.PI);
          ctx.fill();
        })

        ps.eachNode(function(node, pt) {
          var w = node.data.radius;
          if (textShadow) {
            ctx.strokeStyle = "white";
            ctx.lineWidth = 4;
            ctx.strokeText(node.name, pt.x + w + 6, pt.y);
          }
          ctx.fillStyle = "black";
          ctx.fillText(node.name, pt.x + w + 6, pt.y);
        })
      },

      initMouseHandling: function() {
        $(canvas).click(function(e) {
          var pos = $(this).offset();
          var mp = arbor.Point(e.pageX - pos.left, e.pageY - pos.top);
          var hit = ps.nearest(mp);
          if (hit) click(hit);
        });
      },

    }
    return that
  }

  function parseURL(url) {
    var p = document.createElement('a');
    p.href = url;
    return p;
  }

  var LIMIT = 30;
  var MAX_HIST = 20;

  return {
    _ps: function() {
      if (this.ps) return this.ps;
      var self = this;
      var ps = arbor.ParticleSystem(1000, 400, 1);
      ps.parameters({
        gravity: true
      });
      ps.renderer = Renderer(this.$elt, function(hit) {
        self.app.go({
          type: 'id',
          id: hit.node.data.id,
          _id_cache: self._id_cache
        });
      });
      return this.ps = ps;
    },
    _computeRange: function(data) {
      var min_r = data.reach;
      var max_r = data.reach;
      for (var i = 0; i < data.graph.length; i++) {
        var chum = data.graph[i];
        min_r = Math.min(min_r, chum.reach);
        max_r = Math.max(max_r, chum.reach);
      }
      data.min_reach = min_r;
      data.max_reach = max_r;
    },
    _radius: function(reach, min, max, min_r, max_r) {
      if (min_r == max_r) return (min + max) / 2;
      var min_sq = min * min;
      var max_sq = max * max;
      var sc = (((reach * 1) - min_r) / (max_r - min_r)) * (max_sq - min_sq) + min_sq;
      return Math.sqrt(sc);
    },
    _setRadius: function(data, min, max) {
      data.radius = this._radius(data.reach, min, max, data.min_reach, data.max_reach);
      for (var j = 0; j < data.graph.length; j++) {
        var chum = data.graph[j];
        chum.radius = this._radius(chum.reach, min, max, data.min_reach, data.max_reach);
      }
    },
    _rgba: function(rgb, adj) {
      if (!adj) adj = 0;
      var col = [];
      for (var i = 0; i < rgb.length; i++) {
        if (i < 3) col.push(Math.floor(Math.max(0, Math.min(rgb[i] + adj, 255))));
        else col.push(rgb[i]);
      }
      switch (col.length) {
      case 3:
        return 'rgb(' + col.join(', ') + ')';
      case 4:
        return 'rgba(' + col.join(', ') + ')';
      default:
        throw new Error("Bad color");
      }
    },
    _color: function(reach, base, min, max, min_r, max_r) {
      if (min_r == max_r) return this._rgba(base);
      var adj = (((reach * 1) - min_r) / (max_r - min_r)) * (max - min) + min;
      return this._rgba(base, adj);
    },
    _setColor: function(data, base, min, max) {
      data.color = this._color(data.reach, base, min, max, data.min_reach, data.max_reach);
      for (var j = 0; j < data.graph.length; j++) {
        var chum = data.graph[j];
        chum.color = this._color(chum.reach, base, min, max, data.min_reach, data.max_reach);
      }
    },
    _cookData: function(data) {
      this._computeRange(data);
      this._setRadius(data, 5, 50);
      this._setColor(data, [119, 153, 187], -50, 50);
    },
    _findBacon: function(data) {
      var rashers = [];
      if (data.bacon * 1 == 0) return data.id;
      for (var i = 0; i < data.graph.length; i++) {
        var chum = data.graph[i];
        rashers.push({
          id: chum.id,
          rank: chum.bacon * 1 + Math.random()
        });
      }
      rashers.sort(function(a, b) {
        return a.rank - b.rank
      });
      return rashers[0].id;
    },
    _drawGraph: function(data) {
      this._cookData(data);

      var sys = this._ps();
      var max_count = data.graph.length ? data.graph[0].count : 0;
      var nodes = {};
      var edges = {};

      var root = sys.addNode(data.name);
      nodes[data.name] = data;
      this._id_cache[data.id] = data.name;

      for (var i = 0; i < data.graph.length; i++) {
        var chum = data.graph[i];
        this._id_cache[chum.id] = chum.name;
        nodes[chum.name] = chum;
        edges[chum.name] = {
          length: max_count / chum.count,
          color: 'rgba(0, 0, 0, 0.3)'
        };
      }

      var m = {
        nodes: nodes,
        edges: {}
      };

      m.edges[data.name] = edges;
      sys.merge(m);
    },
    _cookHistory: function(hist) {
      var hout = [];
      var jump = 0;
      for (var i = 0; i < hist.length; i++) {
        var name = this._nameFromState(hist[i]);
        if (name !== null) {
          hout.unshift({
            name: name,
            jump: jump
          });
        }
        jump--;
      }
      return hout;
    },
    _drawHistory: function(hist) {
      if (!hist.length) {
        $('#history').hide();
        return;
      }

      var self = this;
      var $hist = $('#history ol');
      $hist.empty();

      var cooked = this._cookHistory(hist);
      var skip = Math.max(0, cooked.length - MAX_HIST);

      $hist.attr({
        start: skip + 1
      });

      for (var i = skip; i < cooked.length; i++) {
        (function(hi) {
          $hist.append($('<li></li>').append($('<a></a>').attr({
            href: '#'
          }).text(hi.name).click(function(e) {
            if (hi.jump < 0) window.history.go(hi.jump);
            e.stopPropagation();
            e.preventDefault();
            return false;
          })));
        })(cooked[i]);
      }
      $('#history').show();
    },
    _setGenomeLink: function(name) {
      var $genome = $('.genome-search');
      $genome.find('.name').text(name);
      $genome.attr({
        href: this._genome(name)
      });
      $genome.show();
    },
    _genome: function(name) {
      var query = '@people "' + name + '"';
      var url = '/search?q=' + encodeURIComponent(query);
      return url;
    },
    _hideGenomeLink: function() {
      $('.genome-search').hide();
    },
    _handleLoad: function(promise) {
      var self = this;
      promise.done(function(data) {
        if (data.status == 'OK') {
          $('.message').removeClass('error').text('');
          self._drawGraph(self.data = data);
          self._setGenomeLink(data.name);
        }
        else if (data.status == 'NOTFOUND') {
          $('.message').addClass('error').text('Not found');
          self._hideGenomeLink();
        }
      }).fail(function(data) {
        $('.message').addClass('error').text('Error loading results. Please try again');
        self._hideGenomeLink();
      }).always(function() {
        self._drawHistory(self.app.stateHistory());
      });
    },
    _random: function() {
      var self = this;
      var _cb = new Date().getTime();
      $.get('/labs/social/random?_cb=' + _cb).done(function(data) {
        self._id_cache[data.id] = data.name;
        self.app.goNew({
          type: 'id',
          id: data.id,
          _id_cache: self._id_cache
        });
      }).fail(function(data) {
        $('.message').addClass('error').text('Error getting random ID. Please try again');
      });
    },
    _goto: function(id) {
      $('#toolbar form').find('input[name="q"]').val('#' + id);
      this._handleLoad($.get('/labs/social/graph/' + LIMIT + '/' + id));
    },
    _search: function(q) {
      $('#toolbar form').find('input[name="q"]').val(q);
      this._handleLoad($.get('/labs/social/search/' + LIMIT, {
        q: q
      }));
    },
    _smart: function(q) {
      var is_id = q.match(/^#(\d+)$/);
      if (is_id) return {
        type: 'id',
        id: is_id[1],
        _id_cache: this._id_cache
      };
      return {
        type: 'search',
        q: q,
        _id_cache: this._id_cache
      };
    },
    _nameFromState: function(st) {
      switch (st.type) {
      case 'init':
        return null;
      case 'search':
        return st.q;
      case 'id':
        if (st._id_cache && st._id_cache[st.id]) return st._id_cache[st.id];
        if (this._id_cache[st.id]) return this._id_cache[st.id];
        return '#' + st.id;
      }
    },
    goToState: function(st) {
      switch (st.type) {
      case 'init':
        break;
      case 'search':
        this._search(st.q);
        break;
      case 'id':
        this._goto(st.id);
        break;
      default:
        throw new Error("Bad state");
      }
    },
    stateFromURL: function(url) {
      var p = parseURL(url);
      var is_id = p.pathname.match(/^\/labs\/social\/(\d+)$/);
      if (is_id) return {
        type: 'id',
        id: is_id[1]
      };
      var is_search = p.search.match(/^\?q=(.+)$/);
      if (is_search) return {
        type: 'search',
        q: decodeURIComponent(is_search[1])
      };
      return {
        type: 'init'
      };
    },
    stateToURL: function(st) {
      var base = '/labs/social';
      switch (st.type) {
      case 'init':
        return base;
      case 'search':
        return base + '?q=' + encodeURIComponent(st.q);
      case 'id':
        return base + '/' + st.id;
      default:
        throw new Error("Bad state");
      }
    },
    run: function(app) {
      var self = this;
      this.app = app;

      this.$elt.attr({
        width: $(window).width(),
        height: $(window).height()
      });

      $('#toolbar form').submit(function(e) {
        var q = $(this).find('input[name="q"]').val();
        if (q.length) self.app.goNew(self._smart(q));
        e.preventDefault();
        e.stopPropagation();
        return false;
      });

      $('#toolbar .btn-random').click(function(e) {
        self._random();
        return false;
      });

      $('#toolbar .btn-bacon').click(function(e) {
        if (!self.data) return;
        var id = self._findBacon(self.data);
        self.app.go({
          type: 'id',
          id: id,
          _id_cache: self._id_cache
        });
        return false;
      });

      $('#toolbar .btn-about').click(function(e) {
        $('#about').fadeIn();
        return false;
      });

//      $(document).on('keydown', function(e) {
//        switch (e.which) {
//        case 112:
//          $('#about').fadeIn();
//          break;
//        case 27:
//          $('#about').fadeOut();
//          break;
//        }
//        return false;
//      });

      $('#about .close').click(function(e) {
        $('#about').fadeOut();
        return false;
      });
    }
  };
})());

$(function() {
  var app = new App(new Social($('#graph')))
  app.run();
});
