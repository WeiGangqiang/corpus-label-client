webpackJsonp([4],{1142:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.setAgentName=t.agentName=t.fetchAgent=t.receiveAgentList=t.requestAgentList=t.fetchServe=t.recevieServeList=t.requestServeList=void 0;var a=n(987),i=n(161),r=n(106),s=t.requestServeList=(0,r.createAction)("request serve list"),l=t.recevieServeList=(0,r.createAction)("receive serve list"),c=(t.fetchServe=(0,i.createAjaxAction)(a.serve.serve,s,l),t.requestAgentList=(0,r.createAction)("request agent list")),o=t.receiveAgentList=(0,r.createAction)("receive agent list"),u=(t.fetchAgent=(0,i.createAjaxAction)(a.serve.agent,c,o),t.agentName=(0,r.createAction)("set agent name"));t.setAgentName=(0,i.createLocalAction)("",u)},956:function(e,t,n){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var i,r,s,l=n(973),c=a(l),o=n(44),u=a(o),d=n(159),f=a(d),g=n(5),v=a(g),p=n(21),m=a(p),h=n(6),A=a(h),x=n(7),y=a(x),L=n(965),_=a(L);n(977),n(969);var b=n(1),E=a(b),S=n(123),k=n(105),N=n(1142),R=(_.default.Item,i=(0,S.connect)(function(e,t){return{config:e.config,serveResult:e.serveResult,agentResult:e.agentResult}}),r=_.default.create({onFieldsChange:function(e,t){}}),i(s=r(s=function(e){function t(e,n){(0,v.default)(this,t);var a=(0,A.default)(this,(t.__proto__||(0,f.default)(t)).call(this,e));return a.state={loading:!1,servePath:"",serveId:1,agentId:1},a}return(0,y.default)(t,e),(0,m.default)(t,[{key:"componentDidMount",value:function(){this.props.dispatch((0,N.fetchAgent)("?host=http://127.0.0.1",function(e){},function(e){console.log(e)}))}},{key:"selectAgent",value:function(e){this.setState({agentId:e.id}),sessionStorage.setItem("agentName",e.name),k.hashHistory.push("/intendList")}},{key:"render",value:function(){var e=this,t=(this.props.form.getFieldDecorator,this.props),n=(t.serveResult,t.agentResult),a={container:{background:"#fff",width:"90%",padding:"0 20px"},flexBox:{display:"flex",flexWrap:"wrap",justifyContent:"space-start"},serveLi:{border:"1px solid #dadada",borderRadius:"5px",padding:"5px 10px",fontSize:"14px",marginBottom:"10px",marginRight:"10px",cursor:"pointer"},agentHead:{lineHeight:"40px"}};return E.default.createElement("div",{style:{marginTop:"55px"}},E.default.createElement("div",{className:"bread-cruft"},E.default.createElement("img",{style:{height:"100%"},src:"../images/logo.png",alt:""})),E.default.createElement(c.default,{spinning:n.loading},n.loading?E.default.createElement("div",null,"数据正在加载中，您可以先去嗑瓜子"):E.default.createElement("div",{style:a.container,className:"container"},E.default.createElement("div",{style:a.agentHead},"机器人列表"),E.default.createElement("ul",{style:a.flexBox},n.data.map(function(t){var n;return E.default.createElement("li",(n={key:t.id,className:t.id==e.state.agentId?"active-btn":"",style:a.serveLi},(0,u.default)(n,"key",t.id),(0,u.default)(n,"onClick",e.selectAgent.bind(e,t)),n),t.name)})))))}}]),t}(b.Component))||s)||s);t.default=R}});