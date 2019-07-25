/*

    Author: stwicher ( https://github.com/stwicher )
    Repository: https://github.com/stwicher/search_injector
    Version: 1.1 2019-07-04

    This Extension adds a custom search result on google and bing results pages

    First this script checks if you searched for a specific term contained in "search_terms" array.
    > The accepted search terms and your search term on google/bing are case insensitive

    If the search term is present the script stores the element that will contain the search results
    and starts to create all the necessary elements to create a final element that is similar
    to every other search result.
    > "Similar" because tracking codes have been removed, a nice feature would be to random generate them

    Example of usage:

    1. Set these variables:

    search_terms = ["gbfinancial", "Gull & Bull Financial", "Gull & Bull"];
    url = "https://gbfinancial.bank";
    name = "Gull & Bull Financial";
    details_text = "Join this fantastic bank website";

    2. Search on google one of the search term that is inside search_terms
       ( "gbfinancial", "Gull & Bull Financial" or "Gull & Bull" )

    3. The extension will Inject this html inside the results page

    GOOGLE:
    
    <div class="g">
        <!--m-->
        <div>
            <div class="rc">
                <div class="r">
                    <a href="https://gbfinancial.bank">
                        <h3 class="LC20lb">Gull & Bull Financial</h3>
                        <br>
                        <div class="TbwUpd">
                            <cite class="iUh30">https://gbfinancial.bank</cite>
                        </div>
                    </a>
                    <span>
                        <div class="action-menu ab_ctl">
                        
                            <a class="GHDvEf ab_button" href="#" id="am-b14" aria-label="Result options"
                            aria-expanded="false" aria-haspopup="true" role="button"
                            jsaction="m.tdd;keydown:m.hbke;keypress:m.mskpe">
                                <span class="mn-dwn-arw">
                                </span>
                            </a>
                        
                            <div class="action-menu-panel ab_dropdown" role="menu" tabindex="-1"
                            jsaction="keydown:m.hdke;mouseover:m.hdhne;mouseout:m.hdhue">
                                <ol>
                                    <li class="action-menu-item ab_dropdownitem" role="menuitem">
                                        <a class="fl"
                                        href="https://webcache.googleusercontent.com/search?q=cache:https://gbfinancial.bank">Cache</a>
                                    </li>
                                </ol>
                            </div>
                        </div>
                    </span>
                </div>
            
                <div class="s">
                    <div><span class="st">Join this fantastic bank website</span></div>
                </div>
            </div>
        </div>
        <!--n-->
    </div>

    BING:
    
    <li class="b_algo" data-bm="13">
        <h2>
            <a href="https://gbfinancial.bank" h="ID=SERP,5162.1">Gull & Bull Financial</a>
        </h2>
        
        <div class="b_caption">
            <div class="b_attribution" u="3|5054|4964923925791731|ry_wVZor5PrRyTRynaglSLSEyVjd3ICe">
                <cite>https://gbfinancial.bank</cite>
                <a href="#" aria-label="Actions for this site"
                aria-haspopup="true" aria-expanded="false" role="button">
                    <span class="c_tlbxTrg">
                        <span class="c_tlbxTrgIcn sw_ddgn"></span>
                        <span class="c_tlbxH" h="BASE:CACHEDPAGEDEFAULT" k="SERP,5163.1"></span>
                    </span>
                </a>
            </div>
            <p>
                Join this fantastic bank website
            </p>
        </div>
    </li>


4. Clicking on the URL or the websites name should bring you to that website (https://gbfinancial.bank)

*/

boold = false; // debug variable, it "skips" search term check

search_terms = ["gbfinancial", "Gull & Bull Financial", "Gull & Bull"]; // array that contains search terms to trigger html injection
url = "https://gbfinancial.bank"; // websites url
name = "Gull & Bull Financial";   // websites name
details_text = "Join this fantastic bank website"; // details text about the website


function anchor(t_arg){

    /*

    @param t_arg: object, properties of anchor tag
    @return anchor: HTMLElement, anchor tag

    This funcion creates an anchor element
    using the properties inside t_arg object.
    (This permits to use "named params")

    The returned anchor element will have:
    * href  : url of a website set in t_arg.url (if specified)
    * id    : id of element set in t_arg.id  (if specified)
    * class : concatenation of classes set in t_arg.classlist array (if specified)

    Example:

    Call:
        anchor({url:"https://www.google.it/", id: "a_tag", classlist: ["my", "custom", "classes"]})

    Return:
        <a href="https://www.google.it/" id="a_tag" class="my custom classes"></a>

    */

    // Create anchor element
    var anchor = document.createElement("a");

    // Set href to <t_arg.url> (if specified in t_arg)
    if (t_arg.url != undefined){
        anchor.href = t_arg.url;
    }

    // If an id property ha been set in t_arg, use it
    if (t_arg.id != undefined){
        anchor.id = t_arg.id;
    }

    // Concatenate each class and store them in classes (if t_arg.classlist is defined)
    if (t_arg.classlist != undefined){

        // Variable that will contain all the classes in t_arg.classlist
        var classes = "";

        for (var _class of t_arg.classlist){
            // each class is separated by a space
            classes += _class + " ";
        }

        // Remove extra space on the right of the classes
        classes = classes.trim();

        // add classes to anchor element
        anchor.classList = classes;
    }

    return anchor;
}


function google_anchor(t_name, t_url){
    
    /*

    @param t_name: string, name of website
    @param t_url: string, url of website
    @return anchor_tag: HTMLElement, anchor tag

    Creates anchor tag for a website that
    is called <t_name> and has url = <t_url>

    Example:

    call:
        google_anchor("Gull & Bull Financial", "https://gbfinancial.bank")

    return:
        <a href="https://gbfinancial.bank">
            <h3 class="LC20lb">Gull & Bull Financial</h3>
            <br>
            <div class="TbwUpd">
                <cite class="iUh30">https://gbfinancial.bank</cite>
            </div>
        </a>

    */

    // Get from anchor() function an anchor tag with href = t_url
    var anchor_tag = anchor({url : t_url});

    // Create h3.LC20lb
    var h3_title = document.createElement("h3");
    h3_title.classList = "LC20lb";

    // Create TextNode for h3.LC20lb with text = <t_name>
    var title_text = document.createTextNode(t_name);

    // Add text <title_text> to <title> h3 Element
    h3_title.appendChild(title_text);

    // Create br element
    var br = document.createElement("br");

    // Create div.TbwUpd for cite element
    var div = document.createElement("div");
    div.classList = "TbwUpd";

    // Create textNode with text <t_url> for cite.iUh30
    var cite_text = document.createTextNode(t_url);

    // Create cite.iUh30 element with t_url as text
    var cite = document.createElement("cite");
    cite.classList = "iUh30";
    cite.appendChild(cite_text);

    // Add cite.iUh30 to div.TbwUpd element
    div.appendChild(cite);

    // Add h3_title, br and div.TbwUpd to anchor tag
    anchor_tag.appendChild(h3_title);
    anchor_tag.appendChild(br);
    anchor_tag.appendChild(div);

    // return anchor element
    return anchor_tag;
}


function google_action_button(){

    /*

    @return anchor_tag: HTMLElement, anchor tag that serves as a button 

    This function creates the small green arrow button next to the websites URL

    Return:
        <a class="GHDvEf ab_button" href="#" id="am-b14" aria-label="Result options"
        aria-expanded="false" aria-haspopup="true" role="button"
        jsaction="m.tdd;keydown:m.hbke;keypress:m.mskpe">
            <span class="mn-dwn-arw">
            </span>
        </a>

    */

    // Get from anchor() function an anchor tag with url, id and classes
    var anchor_tag = anchor({url : "#", id: "am-b14", classlist: ["GHDvEf", "ab_button"]});

    // Add remaining attributes to the anchor element
    anchor_tag.setAttribute('aria-label', 'Result options');                      // aria-label="Result options"
    anchor_tag.setAttribute('aria-expanded', 'false');                            // aria-expanded="false"
    anchor_tag.setAttribute('aria-haspopup', 'true');                             // aria-haspopup="true"
    anchor_tag.setAttribute('role', 'button');                                    // role="button"
    anchor_tag.setAttribute('jsaction', 'm.tdd;keydown:m.hbke;keypress:m.mskpe'); // jsaction="m.tdd;keydown:m.hbke;keypress:m.mskpe"

    // Create span.mn-dwn-arw Element
    var span = document.createElement("span");
    span.classList = "mn-dwn-arw";

    // Put span inside anchor tag
    anchor_tag.appendChild(span);

    // return anchor tag/button
    return anchor_tag;
}


function google_webcache_action(t_url){

    /*

    @param t_url: string, url of the website
    @return webcache_li: HTMLElement, li "button" that creates a cache of the website

    This function creates a li element that goes inside the action dropdown menu
    created inside the google_action_dropdown() function

    Return:

        <li class="action-menu-item ab_dropdownitem" role="menuitem">
            <a class="fl"
            href="https://webcache.googleusercontent.com/search?q=cache:https://gbfinancial.bank">Cache</a>
        </li>

    */

    // create li.action-menu-item.ab_dropdownitem with role="menuitem" for webcache action
    var webcache_li = document.createElement("li");
    webcache_li.classList = "action-menu-item ab_dropdownitem";
    webcache_li.setAttribute('role', 'menuitem');

    // create anchor for webcache action
    var webcache_a = anchor({url : "https://webcache.googleusercontent.com/search?q=cache:" + t_url,
     classlist: ["fl"]
    });

    // create label for webcache action
    var webcache_text = document.createTextNode("Cache");

    // Put webcache text in webcache anchor
    webcache_a.appendChild(webcache_text);

    // Put webcache anchor in webcache li / "button"
    webcache_li.appendChild(webcache_a);

    return webcache_li;
}


function google_action_dropdown(t_url){

    /*

    @param t_url: string, url to use for google webcache
    @return div_tag: HTMLElement, div containing dropdown menu

    This function creates a div element that contains the dropdown menu
    that appears when you click on the green arrow button (element created by google_action_button() function )

    Call:
        google_action_dropdown("https://gbfinancial.bank")
    
    Return:
        <div class="action-menu-panel ab_dropdown" role="menu" tabindex="-1"
        jsaction="keydown:m.hdke;mouseover:m.hdhne;mouseout:m.hdhue">
            <ol>
                <li class="action-menu-item ab_dropdownitem" role="menuitem">
                    <a class="fl"
                    href="https://webcache.googleusercontent.com/search?q=cache:https://gbfinancial.bank">Cache</a>
                </li>
            </ol>
        </div>

    */

    // create main div.action-menu-panel.ab_dropdown with role="menu" and tabindex="-1"
    var div_tag = document.createElement("div");
    div_tag.classList = "action-menu-panel ab_dropdown";
    div_tag.setAttribute('role', 'menu');
    div_tag.setAttribute('tabindex', '-1');

    // create list of actions
    var ol = document.createElement("ol");

    // retrieve webcache action from google_webcache_action() function
    var webcache_li = google_webcache_action(t_url);

    // Put webcache li in actions list
    ol.appendChild(webcache_li);

    // Put the actions list in the main div
    div_tag.appendChild(ol);

    return div_tag;
}


function google_website_details(t_text){

    /*

    @param t_text: string, datails about website
    @return div_details: HTMLElement, div element with websites details

    This function creates the div with the website details that appear under the websites URL

    Example:

    Call:
        google_website_details("Join this fantastic bank website")
    
    Return:
        <div class="s">
            <div>
                <span class="st">Join this fantastic bank website
                </span>
            </div>
        </div>

    */

    // create main div with the details (div.s)
    var main_div = document.createElement("div");
    main_div.classList = "s";

    // create div inside main details div (it will contain a span with the details)
    var details_div = document.createElement("div");

    // create span that contains the text with the details (span.st)
    var details_span = document.createElement("span");
    details_span.classList = "st";

    // create textNode that goes inside the details span
    var details_text = document.createTextNode(t_text);

    // Put details_text in details_span
    details_span.appendChild(details_text);

    // Put details_span in details_div
    details_div.appendChild(details_span);

    // Put details_div in main_div
    main_div.appendChild(details_div);

    // Return the main_div
    return main_div;
}


function bing_website_details(t_text){

    /*

    @param t_text: string, datails about website
    @return p_details: HTMLElement, p element with websites details

    This function creates the paragraph with the website details that appear under the websites URL

    Example:

    Call:
        bing_website_details("Join this fantastic bank website")
    
    Return:
        <p>Join this fantastic bank website</p>

    */

    // Create paragraph element
    var p_details = document.createElement("p");

    // create textNode
    var details_text = document.createTextNode(t_text);

    // Set text
    p_details.appendChild(details_text);

    return p_details;
}


function bing_anchor(t_name, t_url){
    
    /*

    @param t_name: string, name of website
    @param t_url: string, url of website
    @return h2_tag: HTMLElement, anchor tag

    Creates h2 tag for a website that
    is called <t_name> and has url = <t_url>

    Example:

    call:
        bing_anchor("Gull & Bull Financial", "https://gbfinancial.bank")

    return:
        <h2>
            <a href="https://gbfinancial.bank" h="ID=SERP,5162.1">Gull & Bull Financial</a>
        </h2>

    */

    // Create h2 element
    var h2 = document.createElement("h2");

    // Get from anchor() function an anchor tag with href = t_url
    var anchor_tag = anchor({url : t_url});
    anchor_tag.setAttribute('h', 'ID=SERP,5162.1');

    // Create textNode with title
    var anchor_text = document.createTextNode(t_name);

    // set text on anchor
    anchor_tag.appendChild(anchor_text);

    // add anchor to h2
    h2.appendChild(anchor_tag);

    return h2;
}


function bing_action_button(){

    /*

    @return anchor_tag: HTMLElement, anchor tag that serves as a button 

    This function creates the small green arrow button next to the websites URL

    Return:
        <a href="#" aria-label="Actions for this site"
        aria-haspopup="true" aria-expanded="false" role="button">
            <span class="c_tlbxTrg">
                <span class="c_tlbxTrgIcn sw_ddgn"></span>
                <span class="c_tlbxH" h="BASE:CACHEDPAGEDEFAULT" k="SERP,5163.1"></span>
            </span>
        </a>

    */

    // Get from anchor() function an anchor tag with url, id and classes
    var anchor_tag = anchor({url : "#"});

    // Add remaining attributes to the anchor element
    anchor_tag.setAttribute('aria-label', 'Actions for this site'); // aria-label="Result options"
    anchor_tag.setAttribute('aria-expanded', 'false');              // aria-expanded="false"
    anchor_tag.setAttribute('aria-haspopup', 'true');               // aria-haspopup="true"
    anchor_tag.setAttribute('role', 'button');                      // role="button"

    // Create span.mn-dwn-arw Element
    var span = document.createElement("span");
    span.classList = "c_tlbxTrg";

    // Put span inside anchor tag
    anchor_tag.appendChild(span);

    /*

    <span class="c_tlbxTrgIcn sw_ddgn"></span>

    This is created by bing,
    if you create it manually two green arrows will appear

    // First span inside the span 
    var span_1 = document.createElement("span");
    span_1.classList = "c_tlbxTrgIcn sw_ddgn";
    span.appendChild(span_1);
    
    */
    
    // Second span inside the span
    var span_2 = document.createElement("span");
    span_2.classList = "c_tlbxH";
    span_2.setAttribute('h', 'BASE:CACHEDPAGEDEFAULT');
    span_2.setAttribute('k', 'SERP,5163.1');
    span.appendChild(span_2);

    // return anchor tag/button
    return anchor_tag;

}


function bing_citation(t_url){
    /*
    
    @param t_url: string, url of website
    @return div_citation: HTMLElement, citation

    Creates div tag with the citation (url under the websites name)

    Example:

    Call:
        bing_citation("https://gbfinancial.bank")
    
    Return:
        <div class="b_attribution" u="3|5054|4964923925791731|ry_wVZor5PrRyTRynaglSLSEyVjd3ICe">
            <cite>https://gbfinancial.bank</cite>
            <a href="#" aria-label="Actions for this site"
            aria-haspopup="true" aria-expanded="false" role="button">
                <span class="c_tlbxTrg">
                    <span class="c_tlbxTrgIcn sw_ddgn"></span>
                    <span class="c_tlbxH" h="BASE:CACHEDPAGEDEFAULT" k="SERP,5163.1"></span>
                </span>
            </a>
        </div>

    */

    // Create main div with class b_attribution
    var div_citation = document.createElement("div");
    div_citation.classList = "b_attribution";
    div_citation.setAttribute('u', '3|5054|4964923925791731|ry_wVZor5PrRyTRynaglSLSEyVjd3ICe');

    // Create cite element with url
    var cite = document.createElement("cite");
    var cite_text = document.createTextNode(t_url);

    // Add url to cite
    cite.appendChild(cite_text);

    // Create anchor
    var anchor = bing_action_button();

    div_citation.appendChild(cite);
    div_citation.appendChild(anchor);

    return div_citation;
}


function get_searchterm(){

    /*
   
    @return searched_info: object, object with searched term and hostname

    This function uses current URL
    to create an URL object
    from which it collects the q parameter
    (query / search term)
    and the hostname

    */

    var curr_url = window.location.href;            // get current URL
    var url_obj = new URL(curr_url);                // use URL in URL object
    var queryvalue = url_obj.searchParams.get("q"); // get q param value (searched term)
    var hostname = url_obj.hostname;

    var searched_info = {"query_term": queryvalue, // searched term
     "hostname": hostname.split(".")[1]            // hostname (bing/google)
    }
    return searched_info;
}


// Array that contains lowercase search terms
var lowercase_searchterms = []

// Loop over search terms
for (var s_term of search_terms){

    // Append to the array "lowercase_searchterms" each search term written lowercase
    lowercase_searchterms.push(s_term.toLowerCase());
}


var searched_info = get_searchterm();             // get hostname and search term from url
var search_term = searched_info.query_term        // search term from url
var lower_searchterm = search_term.toLowerCase(); // lowercase the search term

var hostname = searched_info.hostname; // hostname ( google/bing )

// element that contains all the search results
if (hostname == "google"){
    // google search
    var res_container = document.getElementById("res"); 
}
else{
    // bing search
    var res_container = document.getElementById("b_results");
}

// check if search_term is in search_terms (or if debug mode is on)
if(lowercase_searchterms.includes(lower_searchterm) || boold){
    
    if (hostname == "google"){
        // google search
        // Create div.g that contains everything
        var main_div = document.createElement("div");
        main_div.classList = "g";

        // Create comment element ( <!--m--> ) inside div.g
        var m_comment = document.createComment("m");
        main_div.appendChild(m_comment);

        // Create div inside div.g
        var div = document.createElement("div");
        main_div.appendChild(div);

        // Create div.rc inside div
        // ( div.rc contains div.r and div.s with the details )
        var rc_div = document.createElement("div");
        rc_div.classList = "rc";
        div.appendChild(rc_div);

        // Create div.r inside div.rc
        // ( div.r contains an anchor tag to the website and its title and a span with the actions menu)
        var r_div = document.createElement("div");
        r_div.classList = "r";
        rc_div.appendChild(r_div);

        // Get div.s from google_website_details() function and put it in div.rc
        var s_div = google_website_details(details_text);
        rc_div.appendChild(s_div);

        // call google_anchor() function to get the anchor tag with the link to the website and its title,
        // then put it inside div.r
        var title_anchor = google_anchor(name, url);
        r_div.appendChild(title_anchor);

        // Create span inside dir.r
        var span = document.createElement("span");
        r_div.appendChild(span);

        // Create div.action-menu.ab_ctl inside the span
        var action_div = document.createElement("div");
        action_div.classList = "action-menu ab_ctl";
        span.appendChild(action_div);

        // Call google_action_button() function to get the green arrow button,
        // then put it inside div.action-menu.ab_ctl
        var action_anchor = google_action_button();
        action_div.appendChild(action_anchor);

        // Call google_action_dropdown() function to get the actions dropdown menu,
        // then put it inside div.action-menu.ab_ctl
        var dropdown_div = google_action_dropdown(url);
        action_div.appendChild(dropdown_div);

        // Create comment element ( <!--n--> ) inside div.g
        var n_comment = document.createComment("n");
        main_div.appendChild(n_comment);

        // Insert the result as the first result of the google search
        res_container.insertBefore(main_div, res_container.childNodes[0]);
    }
    else{
        // Bing search
        var li = document.createElement("li");
        li.classList = "b_algo";
        li.setAttribute('data-bm', '13');

        // Add title to li
        var title_anchor = bing_anchor(name, url);
        li.appendChild(title_anchor);

        // create div_bcaption inside li
        var div_bcaption = document.createElement("div");
        div_bcaption.classList = "b_caption";
        li.appendChild(div_bcaption);

        // put citation in div_bcaption
        var citation = bing_citation(url);
        div_bcaption.appendChild(citation);

        // put website details in div_bcaption
        var website_details = bing_website_details(details_text);
        div_bcaption.appendChild(website_details);

        // Get ad result
        var ad = res_container.getElementsByClassName("b_ad")[0];
        ad.parentNode.insertBefore(li, ad.nextSibling);
    }
}
