!function(o){Drupal.behaviors.owl_accessibility_fix={attach:function(t,e){o(document).ready((function(){var t=null;setTimeout((function e(){var l=0;o(".owl-dot").is("div")?(o(".owl-dot, .owl-prev, .owl-next").attr("tabindex","0"),o(".owl-dot, .owl-prev, .owl-next").on("focus",(function(){o(".owl-dot, .owl-prev, .owl-next").css("outline","none"),o(this).css("outline","#0549b5 solid 2px"),t=o(this)}))):l<9&&(l++,setTimeout(e,1e3))}),100),o(document).on("keypress",(function(e){13===e.keyCode&&t&&(o(t).hasClass("owl-dot")||o(t).hasClass("owl-prev")||o(t).hasClass("owl-next"))&&o(t).trigger("click")}))}))}}}(jQuery,Drupal);