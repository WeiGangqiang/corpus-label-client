webpackJsonp([3],{1002:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.userInfo=t.fetchRegister=t.fetchLogin=void 0;var a=(n(106),n(987)),u=n(161);t.fetchLogin=(0,u.createAjaxAction)(a.common.login),t.fetchRegister=(0,u.createAjaxAction)(a.common.register),t.userInfo=(0,u.createAjaxAction)(a.common.userInfo)},954:function(e,t,n){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var u,o,r,s=n(971),l=a(s),i=n(972),c=a(i),f=n(973),d=a(f),m=n(124),p=a(m),h=n(979),g=a(h),v=n(158),k=a(v),b=n(165),y=a(b),E=n(989),_=a(E),S=n(159),N=a(S),x=n(5),I=a(x),j=n(21),w=a(j),A=n(6),L=a(A),P=n(7),F=a(P),M=n(965),R=a(M);n(975),n(976),n(977),n(162),n(968),n(963),n(166),n(969);var D=n(1),O=a(D),q=(n(164),n(123)),z=n(105),C=n(1002),H=R.default.Item,J=(u=(0,q.connect)(function(e,t){return{config:e.config,loginResponse:e.tabListResult}}),o=R.default.create({onFieldsChange:function(e,t){}}),u(r=o(r=function(e){function t(e,n){(0,I.default)(this,t);var a=(0,L.default)(this,(t.__proto__||(0,N.default)(t)).call(this,e));return a.checkName=function(e,t,n){n()},a.checkPass=function(e,t,n){n()},a.noop=function(){return!1},a.state={loading:!1},a.handleSubmit=a.handleSubmit.bind(a),a.checkPass=a.checkPass.bind(a),a.checkName=a.checkName.bind(a),a.noop=a.noop.bind(a),a}return(0,F.default)(t,e),(0,w.default)(t,[{key:"handleSubmit",value:function(e){var t=this;e.preventDefault(),this.props.form.validateFields(function(e,n){e||((0,_.default)(n).map(function(e){return n[e]=n[e]&&n[e].trim()}),t.props.dispatch((0,C.fetchLogin)(n,function(e){y.default.success(e.msg),sessionStorage.setItem("username",n.username),t.props.dispatch((0,C.userInfo)(n,function(e){sessionStorage.setItem("token",e.data.token),z.hashHistory.push("/selectService")},function(e){y.default.warning(e)}))},function(e){y.default.warning(e.msg),t.setState({loading:!1})})),sessionStorage.setItem("token","dupi"),z.hashHistory.push("/"))})}},{key:"componentDidMount",value:function(){}},{key:"render",value:function(){var e=this.props.form.getFieldDecorator;return O.default.createElement("div",{className:"login"},O.default.createElement("div",{className:"btmLogin"},O.default.createElement("div",{className:"sy_bottom"},O.default.createElement("h1",{id:"PerformName"},"标注系统登陆"),O.default.createElement(l.default,{className:"ul-wrap"},O.default.createElement(c.default,{span:24},O.default.createElement(d.default,{spinning:this.state.loading},O.default.createElement(R.default,{onSubmit:this.handleSubmit},O.default.createElement(H,{hasFeedback:!0},e("username",{rules:[{required:!0,message:"请输入用户名"},{validator:this.checkName}]})(O.default.createElement(g.default,{prefix:O.default.createElement(k.default,{type:"user",style:{fontSize:13}}),placeholder:"请输入用户名",type:"text"}))),O.default.createElement(H,{hasFeedback:!0},e("password",{rules:[{required:!0,message:"请输入密码"}]})(O.default.createElement(g.default,{prefix:O.default.createElement(k.default,{type:"lock",style:{fontSize:13}}),placeholder:"请输入密码",type:"password"}))),O.default.createElement(H,null,O.default.createElement(p.default,{type:"primary",htmlType:"submit"},"登录"),O.default.createElement(z.Link,{to:"/register"},"注册")))))))))}}]),t}(D.Component))||r)||r);t.default=J},989:function(e,t,n){e.exports={default:n(990),__esModule:!0}},990:function(e,t,n){n(991),e.exports=n(24).Object.keys},991:function(e,t,n){var a=n(128),u=n(127);n(406)("keys",function(){return function(e){return u(a(e))}})}});