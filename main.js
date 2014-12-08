Importer.loadQtBinding("qt.core");
Importer.loadQtBinding("qt.xml");
Importer.loadQtBinding("qt.network");
Importer.loadQtBinding("qt.gui");

function SoundCloud()
{
    ScriptableServiceScript.call(this, "SoundCloud", 2, "Search for and listen on SoundCloud.", "soundcloud.com", true);
}

function displayResults(results)
{
    var doc = new QDomDocument;
    doc.setContent(results);

    tracklist = doc.elementsByTagName("track");

    for (var i=0; i<tracklist.length(); i++) {
        try {
            var track = tracklist.at(i); 

            var item = Amarok.StreamItem;

            item.level = 1;
            item.artist = track.firstChildElement("user").firstChildElement("username");
            item.itemName = track.firstChildElement("title");
            item.playableUrl = track.firstChildElement("stream-url");        
            item.coverUrl = track.firstChildElement("artwork-url");
        } catch (error) {
            Amarok.debug(error);
        }

    }

    script.donePopulating();
}

function onPopulate(level, callback, query)
{
    if (query != "") {
        query = query.trim().toLowerCase();
        var url = new QUrl("http://api.soundcloud.com/tracks.xml");
        url.addQueryItem("q", query);
        url.addQueryItem("filter", "streamable");
        var downloader = new Downloader(url, displayResults);
    }
}

function onCustomize()
{
    var cwd = Amarok.Info.scriptPath() + "/";
    script.setIcon(new QPixmap(cwd + "soundcloud.png"));
    script.setEmblem(new QPixmap(cwd + "soundcloud_emblem.png"));
}

script = new SoundCloud();

script.populate.connect(onPopulate);
script.customize.connect(onCustomize);

