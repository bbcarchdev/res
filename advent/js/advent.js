$(function() {

  var bgImageURL = "i/background.jpg";
  var bgImage = null;
  var snowStorm = null;
  var snowFlake = null;
  var offScreenCanvas = null;

  var currentDay = adventDate(new Date());

  var activeDay = -2;

  var images = {
    background: "i/background.jpg",
  };

  var imageStore = {};

  function adventDate(dt) {
    var mo = dt.getMonth();
    if (mo < 6) return 24;
    if (mo < 11) return 0;
    return Math.min(dt.getDate(), 24);
  }

  function nth(x) {
    switch (Math.round(x % 20)) {
      default:
        return "th";
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
    }
  }

  function easer(from, to, steps, step) {
    if (step >= steps) return to;
    var inc = Math.pow(to / from, 1 / steps);
    return from * Math.pow(inc, step);
  }

  function showPopup(data) {
    if (data.url) {
      $("#popup .day-image a, #popup .view-media a, #popup .title a").attr({
        href: data.url
      });
      $("#popup .view-media").show();
    } else {
      $("#popup .day-image a, #popup .view-media a, #popup .title a").removeAttr("href");
      $("#popup .view-media").hide();
    }

    $("#popup .date .day-num").text(data.day + nth(data.day));
    $("#popup .title a").text(data.title);
    $("#popup .synopsis .description").text(data.synopsis);

    $("#popup .day-image img").attr({
      src: data.image_url,
      alt: data.title,
      title: data.title
    });

    $("#popup").show();
  }

  function hidePopup() {
    $("#popup").hide();
  }

  function getQuery() {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    var query = {};
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');
      query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
    }
    return query;
  }

  function fillBox(ctx, img) {
    var cw = ctx.canvas.width;
    var ch = ctx.canvas.height;
    var iw = img.width;
    var ih = img.height;

    if (cw / ch < iw / ih) {
      var sc = ch / ih;
      ctx.drawImage(img, (iw - cw / sc) / 2, 0, cw / sc, ih, 0, 0, cw, ch);
    } else {
      var sc = cw / iw;
      ctx.drawImage(img, 0, (ih - ch / sc) / 2, iw, ch / sc, 0, 0, cw, ch);
    }
  }

  function rgba(r, g, b, a) {
    return "rgba(" + [].slice.call(arguments).join(", ") + ")";
  }

  var snowStep;
  var snowSteps;
  var snowStartXC;
  ;
  var snowStartY;
  var snowStartScale;
  var snowEndScale;
  var snowEndX;
  var snowEndY;

  function scaleSnow(width, height) {
    snowStartX = width / 2;
    snowStartY = height / 2;
    snowStartScale = Math.min(snowStartX, snowStartY) * 3;
    snowEndScale = (width + height) / 50;
  }

  var Renderer = function(canvas, click) {
    var ctx = canvas.getContext("2d");
    var ps;

    snowStep = 0;
    snowSteps = currentDay * 10 + 20;
    snowEndX = null;
    snowEndY = null;
    scaleSnow(canvas.width, canvas.height);

    var that = {
      init: function(system) {
        ps = system;
        ps.screenSize(canvas.width, canvas.height);
        ps.screenPadding(canvas.height / 10, canvas.width / 10);
        that.initMouseHandling();
      },

      drawGraph: function(ctx, past) {
        var alphaPast = 1;
        var alphaFuture = 0.4;
        var radiusPast = (canvas.width + canvas.height) / 30;
        var radiusFuture = radiusPast / 3;

        ctx.save();
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 8]);

        ps.eachEdge(function(edge, pt1, pt2) {
          var edgeDay = Math.max(edge.source.data.day, edge.target.data.day);
          var inPast = edgeDay <= activeDay;
          if (past !== inPast) return;

          ctx.strokeStyle = rgba(255, 255, 255, inPast ? alphaPast : alphaFuture);

          var dx = pt2.x - pt1.x;
          var dy = pt2.y - pt1.y;

          ctx.beginPath();
          ctx.moveTo(pt1.x, pt1.y);
          ctx.lineTo(pt2.x, pt2.y);
          ctx.stroke();
        })

        ctx.restore();

        ctx.save();
        ctx.lineWidth = 2;

        ps.eachNode(function(node, pt) {
          var age = activeDay - node.data.day;
          var inPast = age >= 0;
          if (past != inPast) return;

          var nw = age >= 0 ? radiusPast / (1 + Math.sqrt(age / 3)) : radiusFuture;
          node.data.radius = nw; // cached for later
          ctx.strokeStyle = rgba(255, 255, 255, inPast ? alphaPast : alphaFuture);

          // Outer circle
          ctx.beginPath();
          ctx.moveTo(pt.x + nw, pt.y);
          ctx.arc(pt.x, pt.y, nw, 0, 2 * Math.PI);
          ctx.save();
          ctx.globalCompositeOperation = "destination-out";
          ctx.fill();
          ctx.restore();
          ctx.stroke();

          // Inner circle
          if (age >= 1) {
            ctx.save();
            var rr = nw * 2 / 3;
            ctx.setLineDash([3, 3]);
            ctx.beginPath();
            ctx.moveTo(pt.x + rr, pt.y);
            ctx.arc(pt.x, pt.y, rr, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.restore();

          }

          if (node.data.day == currentDay) {
            snowEndX = pt.x;
            snowEndY = pt.y;
          }
        });

        ctx.restore();
      },

      drawOverlay: function(ctx) {
        ctx.save();
        snowStorm.redraw(ctx);
        ctx.restore();
      },

      redraw: function() {
        ctx.save();

        if (Math.abs(currentDay - activeDay) < 0.1) {
          activeDay = currentDay;
        } else if (activeDay < currentDay)
          activeDay += 0.1;
        else if (activeDay > currentDay)
          activeDay -= 0.1;

        if (imageStore.background) {
          fillBox(ctx, imageStore.background);
        } else {
          ctx.fillStyle = "white";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        var octx = offScreenCanvas.getContext("2d");
        octx.clearRect(0, 0, offScreenCanvas.width, offScreenCanvas.height);
        that.drawOverlay(octx);
        if (currentDay > 0) {
          that.drawGraph(octx, false);
          that.drawGraph(octx, true);
        }

        ctx.drawImage(offScreenCanvas, 0, 0);

        if (currentDay > 0 && snowFlake && activeDay >= 0 && snowEndX !== null) {
          ctx.save();

          var snowX = easer(snowStartX, snowEndX, snowSteps, snowStep);
          var snowY = easer(snowStartY, snowEndY, snowSteps, snowStep);
          var snowScale = easer(snowStartScale, snowEndScale, snowSteps, snowStep);
          ctx.strokeStyle = rgba(255, 255, 255, easer(0.01, 1, snowSteps, snowStep));

          ctx.translate(snowX, snowY);
          ctx.scale(snowScale, snowScale);
          snowFlake.render(ctx);
          ctx.restore();
          snowFlake.spinBy(0.01);
          snowStep++;
        }

        ctx.restore();
      },

      initMouseHandling: function() {
        $(canvas)
          .click(function(e) {
            var pos = $(this)
              .offset();
            var mp = arbor.Point(e.pageX - pos.left, e.pageY - pos.top);
            var hit = ps.nearest(mp);
            if (hit) click(hit);
            if (hit && hit.distance <= hit.node.data.radius && hit.node.data.day <= activeDay) {
              showPopup(hit.node.data);
            }
          }).mousemove(function(e) {
          var pos = $(this)
            .offset();
          var mp = arbor.Point(e.pageX - pos.left, e.pageY - pos.top);
          var hit = ps.nearest(mp);
          if (hit) click(hit);
          if (hit && hit.distance <= hit.node.data.radius && hit.node.data.day <= activeDay) {
            $(this).addClass("clicky");
          } else {
            $(this).removeClass("clicky");
          }
        });
      },

    }
    return that
  }

  function resize(cvs, ps) {
    cvs.width = $(window)
      .width();
    cvs.height = $(window)
      .height();
    ps.screenSize(cvs.width, cvs.height);
    ps.screenPadding(cvs.height / 10, cvs.width / 10);

    // Create offscreen canvas
    offScreenCanvas = document.createElement("canvas");
    offScreenCanvas.width = cvs.width;
    offScreenCanvas.height = cvs.height;
    scaleSnow(cvs.width, cvs.height);
  }

  query = getQuery();
  if (query.day !== undefined)
    currentDay = Math.max(1, Math.min(parseInt(query.day), 24));

  $(document).on('keypress', function(event) {
    if (event.which == 27) hidePopup();
  });

  $("#popup").click(function(ev) {
    hidePopup()
  });

  $("#advent")
    .each(function() {
      var cvs = this;

      snowFlake = new SnowFlake();

      snowStorm = new SnowStorm({
        flakes: 1000,
        gravity: 1.01,
        birthRate: 3
      });

      $.each(images, function(tag, url) {
        var img = $("<img>")
          .attr({
            src: url
          })
          .load(function() {
            imageStore[tag] = img[0];
          });
      });

      $(window)
        .mousemove(function(ev) {
          var xp = (ev.pageX / cvs.width) - 0.5;
          snowStorm.setDrift(xp);
        })
        .resize(function() {
          resize(cvs, ps);
        });

      var ps = arbor.ParticleSystem(1000, 400, 1);

      resize(cvs, ps);

      ps.parameters({
        gravity: true
      });

      ps.renderer = Renderer(cvs, function(hit) {});

      $.get("data.json").then(function(data) {
        console.log("Data loaded", data);
        for (var i = 0; i < data.length; i++) {
          var info = data[i];
          info.day = i + 1;
          ps.addNode("day" + info.day, info);
        }
        var len = 1;
        for (var i = 1; i < data.length; i++) {
          ps.addEdge("day" + i, "day" + (i + 1), {
            length: len
          });
          len *= 1.1;
        }
      }).fail(function(err) {});

      ps.fps(25);

    });
});
