const PLAYER_CSV =
'https://docs.google.com/spreadsheets/d/e/2PACX-1vSfjxQddO15BxkKKZYF9WFg-LcGJsPqaffUnR_W8g3T76h95n78ipqNoSPIHoqsO40LSaAW5NpVO9C3/pub?gid=0&single=true&output=csv';

const COURSE_CSV =
'https://docs.google.com/spreadsheets/d/e/2PACX-1vSfjxQddO15BxkKKZYF9WFg-LcGJsPqaffUnR_W8g3T76h95n78ipqNoSPIHoqsO40LSaAW5NpVO9C3/pub?gid=672018571&single=true&output=csv';

const SETTINGS_CSV =
'https://docs.google.com/spreadsheets/d/e/2PACX-1vSfjxQddO15BxkKKZYF9WFg-LcGJsPqaffUnR_W8g3T76h95n78ipqNoSPIHoqsO40LSaAW5NpVO9C3/pub?gid=659463649&single=true&output=csv';

const ROUND1_CSV =
'https://docs.google.com/spreadsheets/d/e/2PACX-1vSfjxQddO15BxkKKZYF9WFg-LcGJsPqaffUnR_W8g3T76h95n78ipqNoSPIHoqsO40LSaAW5NpVO9C3/pub?gid=1161651500&single=true&output=csv';

const ROUND2_CSV =
'https://docs.google.com/spreadsheets/d/e/2PACX-1vSfjxQddO15BxkKKZYF9WFg-LcGJsPqaffUnR_W8g3T76h95n78ipqNoSPIHoqsO40LSaAW5NpVO9C3/pub?gid=1161557451&single=true&output=csv';

const ROUND3_CSV =
'https://docs.google.com/spreadsheets/d/e/2PACX-1vSfjxQddO15BxkKKZYF9WFg-LcGJsPqaffUnR_W8g3T76h95n78ipqNoSPIHoqsO40LSaAW5NpVO9C3/pub?gid=1861478720&single=true&output=csv';

const MATCHUPS_CSV =
'https://docs.google.com/spreadsheets/d/e/2PACX-1vSfjxQddO15BxkKKZYF9WFg-LcGJsPqaffUnR_W8g3T76h95n78ipqNoSPIHoqsO40LSaAW5NpVO9C3/pub?gid=1270511102&single=true&output=csv';

let settings = {};
let courseData = {};
let leaderboard = {};
let playerHandicaps = {};
let ryderCupMatches = [];
let roundData = {};

async function loadSettings() {

    const response = await fetch(SETTINGS_CSV);
    const text = await response.text();

    const rows = text.split('\n').slice(1);

    rows.forEach(row => {

        if (!row.trim()) return;

        const cols = row.split(',');

        settings[cols[0].trim()] = cols[1].trim();
    });

    if (settings['Event Name']) {
        document.querySelector('h1').textContent =
            `🏌️ ${settings['Event Name']}`;
    }
    
}
async function loadCourseData() {

    const response = await fetch(COURSE_CSV);
    const text = await response.text();

    const rows = text.split('\n');

    const headers = rows[0].split(',');

    const royal = headers[1].trim();
    const pinhal = headers[2].trim();
    const ocean = headers[3].trim();

    courseData[royal] = {};
    courseData[pinhal] = {};
    courseData[ocean] = {};

    rows.forEach(row => {

        const cols = row.split(',');

        const label = cols[0]?.trim();

        if (!label) return;

        if (label === 'Course Rating') {

            courseData[royal].rating = parseFloat(cols[1]);
            courseData[pinhal].rating = parseFloat(cols[2]);
            courseData[ocean].rating = parseFloat(cols[3]);

        }

        if (label === 'Slope Rating') {

            courseData[royal].slope = parseInt(cols[1]);
            courseData[pinhal].slope = parseInt(cols[2]);
            courseData[ocean].slope = parseInt(cols[3]);

        }

        if (label === 'Par') {

            courseData[royal].par = parseInt(cols[1]);
            courseData[pinhal].par = parseInt(cols[2]);
            courseData[ocean].par = parseInt(cols[3]);

        }

        if (label === 'Group 1 Tee Time') {

            courseData[royal].teeTimes = [
                cols[1]
            ];

            courseData[pinhal].teeTimes = [
                cols[2]
            ];

            courseData[ocean].teeTimes = [
                cols[3]
            ];

        }

        if (label === 'Group 2 Tee Time') {

            courseData[royal].teeTimes.push(cols[1]);
            courseData[pinhal].teeTimes.push(cols[2]);
            courseData[ocean].teeTimes.push(cols[3]);

        }

        if (label === 'Group 3 Tee Time') {

            courseData[royal].teeTimes.push(cols[1]);
            courseData[pinhal].teeTimes.push(cols[2]);
            courseData[ocean].teeTimes.push(cols[3]);

        }

    });
    
}

function renderSchedule() {

    const html = `

        <div class="schedule-row">
            <strong>Round 1</strong><br>
            ${settings['Round 1 Date']}<br>
            ${settings['Course 1 Name']}<br>
            ${courseData[settings['Course 1 Name']].teeTimes.join(' • ')}
        </div>

        <div class="schedule-row">
            <strong>Round 2</strong><br>
            ${settings['Round 2 Date']}<br>
            ${settings['Course 2 Name']}<br>
            ${courseData[settings['Course 2 Name']].teeTimes.join(' • ')}
        </div>

        <div class="schedule-row">
            <strong>Round 3</strong><br>
            ${settings['Round 3 Date']}<br>
            ${settings['Course 3 Name']}<br>
            ${courseData[settings['Course 3 Name']].teeTimes.join(' • ')}
        </div>

    `;

    document.getElementById('schedule').innerHTML = html;
}

async function loadPlayers() {

    const response = await fetch(PLAYER_CSV);
    const text = await response.text();

    const rows = text.split('\n').slice(1);

    let html = '';

    rows.forEach(row => {

        if (!row.trim()) return;

        const cols = row.split(',');

        html += `
            <div class="player">
                <strong>${cols[0]}</strong>
                | HI ${cols[1]}
                | ${cols[2]}
            </div>
        `;
    });

    document.getElementById('players').innerHTML = html;
}

async function loadTeams() {

    const response = await fetch(PLAYER_CSV);
    const text = await response.text();

    const rows = text.split('\n').slice(1);

    let north = '';
    let south = '';

    rows.forEach(row => {

        if (!row.trim()) return;

        const cols = row.split(',');

        if (cols[2] === 'North') {
            north += `<div class="team-player">${cols[0]}</div>`;
        }

        if (cols[2] === 'South') {
            south += `<div class="team-player">${cols[0]}</div>`;
        }

    });

    document.getElementById('teams').innerHTML = `
        <div class="team-section">
            <div class="team-title">North</div>
            ${north}
        </div>

        <div class="team-section">
            <div class="team-title">South</div>
            ${south}
        </div>
    `;
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

async function buildLeaderboard() {

    const response = await fetch(PLAYER_CSV);
    const text = await response.text();

    const rows = text.split('\n').slice(1);

    let html = '';

    let position = 1;

    rows.forEach(row => {

        if (!row.trim()) return;

        const cols = row.split(',');

        const player = cols[0];

        html += `
            <div class="leaderboard-row">
                ${position}. ${player} - 0 pts
            </div>
        `;

        position++;
    });

    document.getElementById('leaderboard').innerHTML = html;
}

function renderLeaderboard() {

    const players =
        Object.entries(leaderboard)
            .sort((a, b) => b[1].total - a[1].total);

    let html = '';

    let lastScore = null;
    let position = 0;

    players.forEach(([player, data], index) => {

        if (data.total !== lastScore) {
            position = index + 1;
            lastScore = data.total;
        }

        html += `
            <div class="leaderboard-row">
                ${position}. ${player}
                <br>
                R1: ${data.r1}
                |
                R2: ${data.r2}
                |
                R3: ${data.r3}
                |
                Total: ${data.total}
            </div>
        `;
    });

    document.getElementById('leaderboard').innerHTML = html;
}

async function loadHandicaps() {

    const response = await fetch(PLAYER_CSV);
    const text = await response.text();

    const rows = text.split('\n').slice(1);

    const selectedCourse =
        document.getElementById('courseSelect').value;

const slope =
    courseData[selectedCourse].slope;

    let html = `
    <div class="handicap-row">
        <strong class="handicap-name">Player</strong>
        <strong class="handicap-hi">HI</strong>
        <strong class="handicap-ch">CH</strong>
        <strong class="handicap-ph">PH</strong>
    </div>
`;

    rows.forEach(row => {

    if (!row.trim()) return;

    const cols = row.split(',');

    const player = cols[0];
    const hi = parseFloat(cols[1]);

    const allowance =
        parseFloat(settings['Stableford Allowance']) / 100;

    const courseHandicap =
        Math.round((hi * slope) / 113);

    const playingHandicap =
        Math.round(courseHandicap * allowance);

    html += `
        <div class="handicap-row">
            <div class="handicap-name">${player}</div>
            <div class="handicap-hi">${hi.toFixed(1)}</div>
            <div class="handicap-ch">${courseHandicap}</div>
            <div class="handicap-ph">${playingHandicap}</div>
        </div>
    `;

});   

document.getElementById('handicapTable').innerHTML = html;

}     

async function calculateRound(csvUrl, courseName) {

    const response = await fetch(csvUrl);
    const text = await response.text();

    const rows = text.split('\n');
    
    roundData[courseName] = rows;
    
    const header = rows[1].split(',');

    const slope = courseData[courseName].slope;

    const roundScores = {};

    for (let playerCol = 3; playerCol < header.length; playerCol++) {

        const player = header[playerCol]?.trim();

        if (!player) continue;

        const hi = playerHandicaps[player];

        const courseHandicap =
            Math.round((hi * slope) / 113);

        let totalPoints = 0;

        for (let row = 2; row <= 19; row++) {

            const cols = rows[row].split(',');

            const par =
                parseInt(cols[1]);

            const strokeIndex =
                parseInt(cols[2]);

            const gross =
                parseInt(cols[playerCol]);

            if (isNaN(gross)) continue;

            const shots =
                shotsReceived(
                    courseHandicap,
                    strokeIndex
                );

            const netScore =
                gross - shots;

            totalPoints +=
                stablefordPoints(
                    par,
                    netScore
                );
        }

        roundScores[player] = totalPoints;
    }

    return roundScores;
}

async function calculateRound1Leaderboard() {

    leaderboard = {};

    const playerResponse =
        await fetch(PLAYER_CSV);

    const playerText =
        await playerResponse.text();

    const playerRows =
        playerText.split('\n').slice(1);

    playerHandicaps = {};

    playerRows.forEach(row => {

        if (!row.trim()) return;

        const cols = row.split(',');

        const player = cols[0];

        playerHandicaps[player] =
            parseFloat(cols[1]);

        leaderboard[player] = {
            r1: 0,
            r2: 0,
            r3: 0,
            total: 0
        };

    });

    const r1 =
        await calculateRound(
            ROUND1_CSV,
            'Vale do Lobo Royal'
        );

    const r2 =
        await calculateRound(
            ROUND2_CSV,
            'Pinhal'
        );

    const r3 =
        await calculateRound(
            ROUND3_CSV,
            'Vale do Lobo Ocean'
        );

    Object.keys(leaderboard).forEach(player => {

        leaderboard[player].r1 =
            r1[player] || 0;

        leaderboard[player].r2 =
            r2[player] || 0;

        leaderboard[player].r3 =
            r3[player] || 0;

        leaderboard[player].total =
            leaderboard[player].r1 +
            leaderboard[player].r2 +
            leaderboard[player].r3;

    });
    
    renderLeaderboard();
}
    
function renderLeaderboard() {

    const players =
        Object.entries(leaderboard)
            .sort(
                (a, b) =>
                b[1].total - a[1].total
            );

    let html = `
        <h3>Individual Stableford</h3>
        <table class="leaderboard-table">
            <tr>
                <th>Pos</th>
                <th>Player</th>
                <th>R1</th>
                <th>R2</th>
                <th>R3</th>
                <th>Total</th>
            </tr>
    `;

    let lastScore = null;
    let position = 0;

    players.forEach(([player, data], index) => {

        if (data.total !== lastScore) {
            position = index + 1;
            lastScore = data.total;
        }

        html += `
            <tr>
                <td>${position}</td>
                <td>${player}</td>
                <td>${data.r1}</td>
                <td>${data.r2}</td>
                <td>${data.r3}</td>
                <td><strong>${data.total}</strong></td>
            </tr>
        `;
    });

    html += '</table>';

    document.getElementById('leaderboard').innerHTML = html;
}

function shotsReceived(courseHandicap, strokeIndex) {

    const fullRounds =
        Math.floor(courseHandicap / 18);

    const remainder =
        courseHandicap % 18;

    let shots = fullRounds;

    if (strokeIndex <= remainder) {
        shots++;
    }

    return shots;
}

function stablefordPoints(par, netScore) {

    const diff = par - netScore;

    if (diff >= 3) return 5;
    if (diff === 2) return 4;
    if (diff === 1) return 3;
    if (diff === 0) return 2;
    if (diff === -1) return 1;

    return 0;
}

async function loadRyderCup() {

    const response =
        await fetch(MATCHUPS_CSV);

    const text =
        await response.text();

    const rows =
        text.split('\n');

    let html = `
        <h3>Balls 0 - 0 Shafts</h3>
    `;

    let currentRound = null;

    const matches = [];

    rows.forEach(row => {

        const cols =
            row.split(',')
                .map(x => x.trim());

        const first = cols[0];

        if (!first) return;

        if (first.includes('Round 1')) {
            currentRound = 1;
            html += '<h3>Round 1 - Fourball</h3>';
            return;
        }

        if (first.includes('Round 2')) {
            currentRound = 2;
            html += '<h3>Round 2 - Fourball</h3>';
            return;
        }

        if (first.includes('Round 3')) {
            currentRound = 3;
            html += '<h3>Round 3 - Singles</h3>';
            return;
        }

        if (!first.match(/^\d/))
            return;

        if (currentRound === 1 || currentRound === 2) {

            matches.push({
                round: currentRound,
                teeTime: cols[0],
                teamA: [cols[1], cols[2]],
                teamB: [cols[3], cols[4]]
            });

            let status = 'Not Started';

try {

    const courseName =
        currentRound === 1
            ? 'Vale do Lobo Royal'
            : 'Pinhal';

    const result =
        calculateFourballMatch(
            roundData[courseName],
            courseName,
            [cols[1], cols[2]],
            [cols[3], cols[4]]
        );

    status =
        result.winner === 'Halved'
            ? 'Halved'
            : `${result.winner} ${result.result}`;

} catch (e) {

    status = 'Not Started';

}

html += `
    <div class="fixture">
        <strong>${cols[0]}</strong><br>
        ${cols[1]} / ${cols[2]}
        <br>
        vs
        <br>
        ${cols[3]} / ${cols[4]}
        <br>
        <em>${status}</em>
        <br><br>
    </div>
`;

        } else {

            matches.push({
                round: currentRound,
                teeTime: cols[0],
                teamA: [cols[1]],
                teamB: [cols[2]]
            });

            html += `
                <div class="fixture">
                    <strong>${cols[0]}</strong><br>
                    ${cols[1]}
                    <br>
                    vs
                    <br>
                    ${cols[2]}
                    <br>
                    <em>Not Started</em>
                    <br><br>
                </div>
            `;
        }

    });

    ryderCupMatches = matches;

    document
        .getElementById('rydercup')
        .innerHTML = html;
}

function getPlayerHoleScore(rows, playerName, holeNumber) {

    const header =
        rows[1].split(',');

    const playerIndex =
        header.findIndex(
            h => h.trim() === playerName
        );

    if (playerIndex === -1)
        return null;

    const holeRow =
        rows[holeNumber + 1].split(',');

    return Number(
        holeRow[playerIndex]
    );
}

function getStrokeIndex(rows, holeNumber) {

    const holeRow =
        rows[holeNumber + 1].split(',');

    return Number(holeRow[2]);
}

function getNetScore(
    rows,
    playerName,
    holeNumber,
    courseHandicap
) {

    const gross =
        getPlayerHoleScore(
            rows,
            playerName,
            holeNumber
        );

    const strokeIndex =
        getStrokeIndex(
            rows,
            holeNumber
        );

    const shots =
        shotsReceived(
            courseHandicap,
            strokeIndex
        );

    return gross - shots;
}

function getCourseHandicap(
    playerName,
    courseName
) {

    const hi =
        playerHandicaps[playerName];

    const slope =
        courseData[courseName].slope;

    return Math.round(
        (hi * slope) / 113
    );
}

function calculateFourballHole(
    rows,
    courseName,
    teamA,
    teamB,
    holeNumber
) {

    const bestA = Math.min(
        getNetScore(
            rows,
            teamA[0],
            holeNumber,
            getCourseHandicap(
                teamA[0],
                courseName
            )
        ),
        getNetScore(
            rows,
            teamA[1],
            holeNumber,
            getCourseHandicap(
                teamA[1],
                courseName
            )
        )
    );

    const bestB = Math.min(
        getNetScore(
            rows,
            teamB[0],
            holeNumber,
            getCourseHandicap(
                teamB[0],
                courseName
            )
        ),
        getNetScore(
            rows,
            teamB[1],
            holeNumber,
            getCourseHandicap(
                teamB[1],
                courseName
            )
        )
    );

    if (bestA < bestB) return 'A';

    if (bestB < bestA) return 'B';

    return 'H';
}

function calculateFourballMatch(
    rows,
    courseName,
    teamA,
    teamB
) {

    let teamAHoles = 0;
    let teamBHoles = 0;

    for (let hole = 1; hole <= 18; hole++) {

        const result =
            calculateFourballHole(
                rows,
                courseName,
                teamA,
                teamB,
                hole
            );

        if (result === 'A')
            teamAHoles++;

        if (result === 'B')
            teamBHoles++;
    }

    if (teamAHoles > teamBHoles) {

        return {
            winner: 'Balls',
            result: `${teamAHoles}-${teamBHoles}`
        };

    }

    if (teamBHoles > teamAHoles) {

        return {
            winner: 'Shafts',
            result: `${teamBHoles}-${teamAHoles}`
        };

    }

    return {
        winner: 'Halved',
        result: 'Halved'
    };
}

async function initialise() {

    await loadSettings();
    await loadCourseData();

    renderSchedule();

    loadPlayers();

    loadTeams();

    buildLeaderboard();

    loadHandicaps();
    
    await calculateRound1Leaderboard();
  
    await loadRyderCup();

    document
        .getElementById('courseSelect')
        .addEventListener('change', loadHandicaps);
}

initialise();
