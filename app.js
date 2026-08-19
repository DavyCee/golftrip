const PLAYER_CSV =
'https://docs.google.com/spreadsheets/d/e/2PACX-1vSfjxQddO15BxkKKZYF9WFg-LcGJsPqaffUnR_W8g3T76h95n78ipqNoSPIHoqsO40LSaAW5NpVO9C3/pub?gid=0&single=true&output=csv';

const COURSE_CSV =
'https://docs.google.com/spreadsheets/d/e/2PACX-1vSfjxQddO15BxkKKZYF9WFg-LcGJsPqaffUnR_W8g3T76h95n78ipqNoSPIHoqsO40LSaAW5NpVO9C3/pub?gid=672018571&single=true&output=csv';

async function loadPlayers() {

    const response = await fetch(PLAYER_CSV);
    const text = await response.text();

    const rows = text.split('\n').slice(1);

    let html = '';

    rows.forEach(row => {

        if (!row.trim()) return;

        const cols = row.split(',');

        const player = cols[0];
        const handicap = cols[1];
        const team = cols[2];

        html += `
            <div class="player">
                <strong>${player}</strong>
                | HI ${handicap}
                | ${team}
            </div>
        `;
    });

    document.getElementById('players').innerHTML = html;
}

async function loadCourses() {

    const response = await fetch(COURSE_CSV);
    const text = await response.text();

    const rows = text.split('\n');

    const courseNames = [
        'Vale do Lobo Royal',
        'Pinhal',
        'Vale do Lobo Ocean'
    ];

    let html = '';

    courseNames.forEach(course => {
        html += `<div class="course">${course}</div>`;
    });

    document.getElementById('courses').innerHTML = html;
}

loadPlayers();
loadCourses();
