var dbPromise = idb.open("ligapremier21", 1, function(upgradeDb) {
    if (!upgradeDb.objectStoreNames.contains("fav_team")) {
        var peopleOS = upgradeDb.createObjectStore("fav_team");
        peopleOS.createIndex("id", "id", { unique: true });
    }
});

// read
function dbteamFavorite() {
    dbPromise.then(function(db) {
        var tx = db.transaction('fav_team', 'readonly');
        var store = tx.objectStore('fav_team');
        return store.getAll();
    }).then(function(val) {
        var isi = "";
        val.forEach(function(team) {
            isi += `
            <div class="card horizontal col s8 pull-s2 push-s2">
      <div class="card-image">
          <img src="${team.crestUrl}" class="responsive-img" style="width:70px; padding-top: 20px; padding-left: 20px;">
      </div>
      <div class="card-stacked">
          <div class="card-content">
              <h4 style="margin-top: -10px;">${team.name}</h4>
              <p>
                  <b>Club Color : </b> ${team.clubColors} <br>
                  <b>Venue : </b> ${team.venue} <br>
                  <b>Address : </b> ${team.address} <br>
                  <b>Website : </b> ${team.website}<br>
              </p>
          </div>
          <a href="#" class="delete right-align" style="padding-right: 30px;">
            <i class="small material-icons">delete</i>
          </a>
          <div class="card-action">
          <a href="detailteam.html?id_team=${team.id}">More Detail</a>
          </div>
      </div>
      </div>
            `;
        });
        if (val.length === 0) isi += `<h6 class="center-align">Tidak ada tim favorite!!</6>`;
        document.getElementById("team_favorite").innerHTML = isi;

        const el = document.getElementById("team_favorite").getElementsByClassName("delete");
        for (let i = 0; i < el.length; i++) {
            el[i].onclick = () => {
                dbDeleteTeam(val[i].id);
                dbteamFavorite();
            }
        }

    });
}

// save
function dbSaveTeam(team) {
    dbPromise.then(function(db) {
        var tx = db.transaction('fav_team', 'readwrite');
        var store = tx.objectStore('fav_team');
        store.put(team, team.id);
        return tx.complete;
    }).then(function() {
        var toastHTML = '<span>Team Favorit berhasil disimpan!</span><a class="btn-flat toast-action" href="saved.html">Buka</button>';
        M.toast({ html: toastHTML });
        console.log('Team Favorit berhasil disimpan.');
    }).catch(function() {
        var toastHTML = '<span>Team Favorit gagal disimpan!</span>';
        M.toast({ html: toastHTML });
        console.log('Team Favorit gagal disimpan.')
    })
}

// hapus
function dbDeleteTeam(id) {
    dbPromise.then(function(db) {
        var tx = db.transaction('fav_team', 'readwrite');
        var store = tx.objectStore('fav_team');
        store.delete(id);
        return tx.complete;
    }).then(function() {
        var toastHTML = '<span>Team Favorit berhasil dihapus!</span>';
        M.toast({ html: toastHTML });
        console.log('Team Favorit Berhasil dihapus');
    });
}