
var tpl_alert = '<div class="pop-container ub ub-ac ub-pc ub-img7 animated fadeIn" data-close-ani="bounceOut">'
                        +'<div class="alert ub ub-ver animated bounceIn pop-content">'
                            +'{{if title}}'
                            +'<div class="title ub ub-pc fon-s36">{{title}}</div>'
                            +'{{/if}}'
                            +'<div class="_content ub ub-pc tc-999 fon-s28 line-h40 tx-c">{{content?content:"确定？"}}</div>'
                            +'{{if buttons.length>0}}'
                                +'<div class="buttons ub bor-ce0e0e0 tc-999">'
                                    +'{{each buttons as value i}}'
                                        +'<div class="ub ub-ac ub-pc ub-f1 ub-fh button bor-ce0e0e0">{{value}}</div>'
                                    +'{{/each}}'
                                +'</div>'
                            +'{{/if}}'
                        +'</div>'
                    +'</div>';
                    
var tpl_print = '<div class="pop-container ub ub-ac ub-pc animated fadeIn" data-close-ani="bounceOutUp">'
                            +'<div class="ub ub-ver animated bounceInDown bg-print ub-img pop-content">'
                                +' <div class="text tc-999 fon-s26 ub ub-pc">流水号：{{code}}</div>'
                                 +'<div class="submit button ub ub-ac ub-pc bc-main-blue tc-fff" data-close="no">发送</div>'
                            +'</div>'
                            +'<div class="icon-guanbi ub-img button animated zoomIn"></div>'
                       +'</div>';
var tpl_toast = '<div class="toast ub ub-ac ub-pc ub-ver animated fadeIn"> '
                            +'<div class="{{icon?icon:"hide"}}  ub-img7 mag-b32"></div> '
                            +'<div class="txt tc-fff">{{msg}}</div> '
                        +'</div>' ;
