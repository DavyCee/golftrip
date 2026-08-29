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
let playerTeams = {};
let ryderPlayerPoints = {};
let ryderPlayerRecords = {};
let biggestRyderWin = null;
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
            ` ${settings['Event Name']}`;

        document.getElementById('eventTitle').innerHTML =
    `🇵🇹 ${settings['Event Name']}🇵🇹`;

document.getElementById('eventTeams').innerHTML =
    `${settings['Team A Name']} vs ${settings['Team B Name']}`;

    }

}

function loadVillaInfo() {

    document
        .getElementById('villaInfo')
        .innerHTML = `
            <h2>🏡 Villa Details </h2>

            <p>
                Volta da Popa 20<br>
                8125-523 Vilamoura
            </p>

            <p>
                <a
                    href="https://maps.google.com/?q=Volta+da+Popa+20+8125-523+Vilamoura"
                    target="_blank"
                    class="villa-link"
                >
                    📍 Open in Google Maps
                </a>
            </p>
        `;
}

async function loadCourseData() {

    const response =
        await fetch(COURSE_CSV);

    const text =
        await response.text();

    const rows =
        text.split('\n');

    const headers =
        rows[0].split(',');

    const royal =
        headers[1].trim();

    const pinhal =
        headers[2].trim();

    const ocean =
        headers[3].trim();

    courseData[royal] = {};
    courseData[pinhal] = {};
    courseData[ocean] = {};

    rows.forEach(row => {

        const cols =
            row.split(',');

        const label =
            cols[0]?.trim();

        if (!label)
            return;

        if (label === 'Course Rating') {

            courseData[royal].rating =
                parseFloat(cols[1]);

            courseData[pinhal].rating =
                parseFloat(cols[2]);

            courseData[ocean].rating =
                parseFloat(cols[3]);

        }

        if (label === 'Slope Rating') {

            courseData[royal].slope =
                parseInt(cols[1]);

            courseData[pinhal].slope =
                parseInt(cols[2]);

            courseData[ocean].slope =
                parseInt(cols[3]);

        }

        if (label === 'Par') {

            courseData[royal].par =
                parseInt(cols[1]);

            courseData[pinhal].par =
                parseInt(cols[2]);

            courseData[ocean].par =
                parseInt(cols[3]);

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

            courseData[royal].teeTimes.push(
                cols[1]
            );

            courseData[pinhal].teeTimes.push(
                cols[2]
            );

            courseData[ocean].teeTimes.push(
                cols[3]
            );

        }

        if (label === 'Group 3 Tee Time') {

            courseData[royal].teeTimes.push(
                cols[1]
            );

            courseData[pinhal].teeTimes.push(
                cols[2]
            );

            courseData[ocean].teeTimes.push(
                cols[3]
            );

        }

    });

}

function loadCourseSelector() {

    let html = '';

    Object.keys(courseData)
        .forEach(courseName => {

            html += `
                <option value="${courseName}">
                    ${courseName}
                </option>
            `;
        });

    document
        .getElementById('courseSelect')
        .innerHTML = html;
}

function renderSchedule() {

    const html = `

        <div class="schedule-row">
            <strong class="round-label">Round 1</strong>
            <span class="schedule-date">${settings['Round 1 Date']}</span>
            <span class="schedule-course">${settings['Course 1 Name']}</span>
            <span class="schedule-times">${courseData[settings['Course 1 Name']].teeTimes.join(' • ')}</span>
        </div>

        <div class="schedule-row">
            <strong class="round-label">Round 2</strong>
            <span class="schedule-date">${settings['Round 2 Date']}</span>
            <span class="schedule-course">${settings['Course 2 Name']}</span>
            <span class="schedule-times">${courseData[settings['Course 2 Name']].teeTimes.join(' • ')}</span>
        </div>

        <div class="schedule-row">
            <strong class="round-label">Round 3</strong>
            <span class="schedule-date">${settings['Round 3 Date']}</span>
            <span class="schedule-course">${settings['Course 3 Name']}</span>
            <span class="schedule-times">${courseData[settings['Course 3 Name']].teeTimes.join(' • ')}</span>
        </div>

    `;

    document.getElementById('schedule').innerHTML = html;
}

async function loadTeams() {

    const response =
        await fetch(PLAYER_CSV);

    const text =
        await response.text();

    const rows =
        text.split('\n');

    const teamA = [];
    const teamB = [];
    playerTeams = {};

    let captainA = '';
    let captainB = '';

    rows.slice(1).forEach(row => {

        const cols =
            row.split(',')
                .map(x => x.trim());

        if (!cols[0]) return;

        const playerName = cols[0];
        const teamName = cols[2];
        playerTeams[playerName] = teamName;

       const isCaptain =
    cols[3]?.toLowerCase() === 'yes';

if (
    teamName === settings['Team A Name']
) {

    if (isCaptain) {
        captainA = playerName;
    } else {
        teamA.push(playerName);
    }
}

if (
    teamName === settings['Team B Name']
) {

    if (isCaptain) {
        captainB = playerName;
    } else {
        teamB.push(playerName);
    }
}

    });

    const surname = player => player.trim().split(/\s+/).pop();
    const sortBySurname = (playerA, playerB) =>
        surname(playerA).localeCompare(surname(playerB));

    teamA.sort(sortBySurname);
    teamB.sort(sortBySurname);

    document
        .getElementById('teams')
        .innerHTML = `
        <div class="team-columns">

            <div class="team-column">

                <h3>${settings['Team A Name']}</h3>

                <div class="captain">
                ${captainA} (C)
                </div>

                ${teamA
                .map(
                player =>
                `<div data-player="${player}">${player}<span class="team-record"></span></div>`
                )
                .join('')}

            </div>

            <div class="team-column">

                <h3>${settings['Team B Name']}</h3>

               <div class="captain">
                ${captainB} (C)
                </div>

               ${teamB
                .map(
                player =>
                `<div data-player="${player}">${player}<span class="team-record"></span></div>`
                )
                .join('')}

            </div>

        </div>
    `;
}

function renderTeamRecords() {
    document.querySelectorAll('[data-player]').forEach(element => {
        const record = ryderPlayerRecords[element.dataset.player];
        if (!record) return;

        element.querySelector('.team-record').textContent =
            `${record.wins}-${record.losses}-${record.draws}`;
    });
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

function loadScorecardCourses() {

    document
        .getElementById('scorecardCourse')
        .innerHTML = `
            <option value="1">
                ${settings['Course 1 Name']}
            </option>

            <option value="2">
                ${settings['Course 2 Name']}
            </option>

            <option value="3">
                ${settings['Course 3 Name']}
            </option>
        `;
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
            .sort(
                (a, b) =>
                    b[1].total - a[1].total
            );

    let html = `
        <table class="leaderboard-table">
            <thead>
                <tr>
                    <th>Pos</th>
                    <th>Player</th>
                    <th>R1</th>
                    <th>R2</th>
                    <th>R3</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
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
                <td>
                    <strong>
                        ${data.total}
                    </strong>
                </td>
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>
    `;

    document
        .getElementById('leaderboard')
        .innerHTML = html;
}

async function loadHandicaps() {

    const response = await fetch(PLAYER_CSV);
    const text = await response.text();

    const rows = text.split('\n').slice(1);

    rows.sort((a, b) => {

    const surnameA =
        a.split(',')[0]
            .trim()
            .split(' ')
            .pop()
            .toLowerCase();

    const surnameB =
        b.split(',')[0]
            .trim()
            .split(' ')
            .pop()
            .toLowerCase();

    return surnameA.localeCompare(surnameB);

});

    const selectedCourse =
        document.getElementById('courseSelect').value;

console.log(
    'Selected course:',
    selectedCourse
);

console.log(
    'Course lookup:',
    courseData[selectedCourse]
);

if (!courseData[selectedCourse]) {

    console.error(
        'Course not found:',
        selectedCourse
    );

    return;
}

const slope =
    courseData[selectedCourse].slope;

   let html = `
    <div class="handicap-row handicap-header">
        <strong class="handicap-name">Player</strong>
        <strong class="handicap-score">Course Hcp</strong>
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
        <div class="handicap-score">
            ${courseHandicap}
        </div>
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
        settings['Course 1 Name']
    );

const r2 =
    await calculateRound(
        ROUND2_CSV,
        settings['Course 2 Name']
    );

const r3 =
    await calculateRound(
        ROUND3_CSV,
        settings['Course 3 Name']
    );

    console.log(
    'ROUND 3 ROWS:',
    roundData[settings['Course 3 Name']]
);

console.log(
    'ROUND 3 SCORES:',
    r3
);

console.log(
    'PLAYERS:',
    Object.keys(leaderboard)
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

    await loadRyderCup();
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

    let ballsPoints = 0;
    let shaftsPoints = 0;

    let html = '';

    let currentRound = null;

    const matches = [];
    ryderPlayerPoints = {};
    ryderPlayerRecords = {};
    biggestRyderWin = null;

    Object.keys(playerTeams).forEach(player => {
        ryderPlayerPoints[player] = 0;
        ryderPlayerRecords[player] = { wins: 0, losses: 0, draws: 0 };
    });

    const awardPlayerPoints = (players, points) => {

    players.forEach(player => {

        ryderPlayerPoints[player] =
            (ryderPlayerPoints[player] || 0) + points;

    });

};

const recordRyderMatch = (
    teamAPlayers,
    teamBPlayers,
    winningTeam,
    resultText
) => {

    const allPlayers = [
        ...teamAPlayers,
        ...teamBPlayers
    ];

    if (!winningTeam || !allPlayers.length)
        return;

    allPlayers.forEach(player => {

        if (!ryderPlayerRecords[player]) {

            ryderPlayerRecords[player] = {
                wins: 0,
                losses: 0,
                draws: 0
            };

        }

    });

    if (winningTeam === 'Halved') {

        allPlayers.forEach(player => {

            ryderPlayerRecords[player].draws += 1;

        });

    } else {

        teamAPlayers.forEach(player => {

            if (
                winningTeam ===
                settings['Team A Name']
            ) {

                ryderPlayerRecords[player].wins += 1;

            } else {

                ryderPlayerRecords[player].losses += 1;

            }

        });

        teamBPlayers.forEach(player => {

            if (
                winningTeam ===
                settings['Team B Name']
            ) {

                ryderPlayerRecords[player].wins += 1;

            } else {

                ryderPlayerRecords[player].losses += 1;

            }

        });

    }

    const marginMatch =
        resultText.match(
            /(\d+)\s*&\s*(\d+)|^(\d+)\s+Up$/i
        );

    const margin =
        marginMatch
            ? Number(
                marginMatch[1] ||
                marginMatch[3]
            )
            : 0;

    if (
        margin &&
        (
            !biggestRyderWin ||
            margin > biggestRyderWin.margin
        )
    ) {

        const winningPlayers =
            winningTeam ===
            settings['Team A Name']
                ? teamAPlayers
                : teamBPlayers;

        biggestRyderWin = {
            margin,
            team: winningTeam,
            players:
                winningPlayers.join(' / '),
            result: resultText
        };

    }

};

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

            const firstPairTeam = playerTeams[cols[1]];
            const secondPairTeam = playerTeams[cols[3]];

            matches.push({
                round: currentRound,
                teeTime: cols[0],
                teamA: [cols[1], cols[2]],
                teamB: [cols[3], cols[4]]
            });

            let status = 'Not Started';
            let matchOutcome = 'not-started';

try {

   const courseName =
    currentRound === 1
        ? settings['Course 1 Name']
        : settings['Course 2 Name'];

    const result =
        calculateFourballMatch(
            roundData[courseName],
            courseName,
            [cols[1], cols[2]],
            [cols[3], cols[4]]
        );
if (result.status === 'finished') {

    matchOutcome = result.winner === 'Halved'
        ? 'halved'
        : result.winner === 'A'
            ? 'team-a'
            : 'team-b';

} else if (result.status === 'live') {
    matchOutcome = 'live';
} else {
    matchOutcome = 'not-started';
}

    const winningTeam = result.winner === 'A'
        ? firstPairTeam
        : result.winner === 'B'
            ? secondPairTeam
            : null;

    if (result.status === 'finished') {
        recordRyderMatch(
            firstPairTeam === settings['Team A Name'] ? [cols[1], cols[2]] : [cols[3], cols[4]],
            firstPairTeam === settings['Team B Name'] ? [cols[1], cols[2]] : [cols[3], cols[4]],
            winningTeam || 'Halved',
            result.result
        );
    }

    matchOutcome = winningTeam === settings['Team A Name']
        ? 'team-a'
        : winningTeam === settings['Team B Name']
            ? 'team-b'
            : 'halved';

    if (winningTeam === settings['Team A Name']) {

        awardPlayerPoints(
            firstPairTeam === settings['Team A Name']
                ? [cols[1], cols[2]]
                : [cols[3], cols[4]],
            Number(settings['Ryder Cup Points Win'])
        );

        shaftsPoints += Number(
            settings['Ryder Cup Points Win']
        );

    } else if (winningTeam === settings['Team B Name']) {

        awardPlayerPoints(
            firstPairTeam === settings['Team B Name']
                ? [cols[1], cols[2]]
                : [cols[3], cols[4]],
            Number(settings['Ryder Cup Points Win'])
        );

        ballsPoints += Number(
            settings['Ryder Cup Points Win']
        );

    } else if (result.winner === 'Halved') {

        awardPlayerPoints(
            [cols[1], cols[2], cols[3], cols[4]],
            Number(settings['Ryder Cup Points Half'])
        );

        ballsPoints += Number(
            settings['Ryder Cup Points Half']
        );

        shaftsPoints += Number(
            settings['Ryder Cup Points Half']
        );
    }

status = result.result;

if (
    result.status === 'finished' &&
    result.winner &&
    result.winner !== 'Halved'
) {

   const winnerName = winningTeam;

status =
    `${winnerName} Won ${result.result}`;

}

} catch (e) {

    console.error(e);

    status = 'ERROR';

}

const teamAPair = firstPairTeam === settings['Team A Name']
    ? `${cols[1]} / ${cols[2]}`
    : `${cols[3]} / ${cols[4]}`;
const teamBPair = firstPairTeam === settings['Team B Name']
    ? `${cols[1]} / ${cols[2]}`
    : `${cols[3]} / ${cols[4]}`;

html += `
    <div class="fixture match-${matchOutcome}">
        <div class="fixture-heading">
            <strong>Fourball</strong>
            <span>${cols[0]}</span>
        </div>
        <div class="match-result">${status}</div>
        <div class="fixture-teams">
            <div class="fixture-team fixture-team-a">
                <strong>${settings['Team A Name']}</strong>
                <span>${teamAPair}</span>
            </div>
            <div class="fixture-team fixture-team-b">
                <strong>${settings['Team B Name']}</strong>
                <span>${teamBPair}</span>
            </div>
        </div>
    </div>
`;

       } else {

    matches.push({
        round: currentRound,
        teeTime: cols[0],
        teamA: [cols[1]],
        teamB: [cols[2]]
    });

    const firstPlayerTeam = playerTeams[cols[1]];
    const secondPlayerTeam = playerTeams[cols[2]];

let singlesStatus = 'Not Started';
let singlesOutcome = 'live';

try {

    const result =
        calculateSinglesMatch(
            roundData[
                settings['Course 3 Name']
            ],
            settings['Course 3 Name'],
            cols[1],
            cols[2]
        );

    /*
     * Display the match calculation immediately.
     * This means a problem recording player statistics
     * cannot hide a valid match result.
     */
    if (result.status === 'finished') {

        singlesStatus =
            result.winner === 'A'
                ? `${settings['Team A Name']} Won ${result.result}`
                : result.winner === 'B'
                    ? `${settings['Team B Name']} Won ${result.result}`
                    : result.result;

    } else {

        singlesStatus =
            result.result;

    }

    /*
     * Handle the visual state separately.
     */
    if (result.status === 'finished') {

        singlesOutcome =
            result.winner === 'Halved'
                ? 'halved'
                : result.winner === 'A'
                    ? 'team-a'
                    : 'team-b';

    } else if (result.status === 'live') {

        singlesOutcome = 'live';

    } else {

        singlesOutcome = 'not-started';

    }

    /*
     * Only record statistics after the result
     * has already been safely established.
     */
    if (result.status === 'finished') {

        const winningTeam =
            result.winner === 'A'
                ? firstPlayerTeam
                : result.winner === 'B'
                    ? secondPlayerTeam
                    : 'Halved';

        recordRyderMatch(
            firstPlayerTeam === settings['Team A Name']
                ? [cols[1]]
                : [cols[2]],

            firstPlayerTeam === settings['Team B Name']
                ? [cols[1]]
                : [cols[2]],

            winningTeam,

            result.result
        );

        if (
            winningTeam ===
            settings['Team A Name']
        ) {

            awardPlayerPoints(
                [firstPlayerTeam === settings['Team A Name']
                    ? cols[1]
                    : cols[2]],

                Number(
                    settings['Ryder Cup Points Win']
                )
            );

            ballsPoints += Number(
                settings['Ryder Cup Points Win']
            );

        } else if (
            winningTeam ===
            settings['Team B Name']
        ) {

            awardPlayerPoints(
                [firstPlayerTeam === settings['Team B Name']
                    ? cols[1]
                    : cols[2]],

                Number(
                    settings['Ryder Cup Points Win']
                )
            );

            shaftsPoints += Number(
                settings['Ryder Cup Points Win']
            );

        } else {

            awardPlayerPoints(
                [cols[1], cols[2]],

                Number(
                    settings['Ryder Cup Points Half']
                )
            );

            ballsPoints += Number(
                settings['Ryder Cup Points Half']
            );

            shaftsPoints += Number(
                settings['Ryder Cup Points Half']
            );

        }

    }

} catch (e) {

    console.error(
        'SINGLES ERROR:',
        cols[1],
        'vs',
        cols[2],
        e
    );

    /*
     * Do NOT hide the match calculation.
     */
    if (
        typeof singlesStatus ===
        'undefined' ||
        singlesStatus === 'Not Started'
    ) {

        singlesStatus = 'ERROR';

    }

}

const teamAPlayer = firstPlayerTeam === settings['Team A Name']
    ? cols[1]
    : cols[2];
const teamBPlayer = firstPlayerTeam === settings['Team B Name']
    ? cols[1]
    : cols[2];

    html += `
        <div class="fixture match-${singlesOutcome}">
            <div class="fixture-heading">
                <strong>Singles</strong>
                <span>${cols[0]}</span>
            </div>
            <div class="match-result">${singlesStatus}</div>
            <div class="fixture-teams">
                <div class="fixture-team fixture-team-a">
                    <strong>${settings['Team A Name']}</strong>
                    <span>${teamAPlayer}</span>
                </div>
                <div class="fixture-team fixture-team-b">
                    <strong>${settings['Team B Name']}</strong>
                    <span>${teamBPlayer}</span>
                </div>
            </div>
        </div>
    `;
}
    });

    ryderCupMatches = matches;

const scoreboard = `
    <div class="ryder-scoreboard ${ballsPoints === shaftsPoints ? 'is-tied' : 'has-leader'}">

        <div class="ryder-team ${shaftsPoints > ballsPoints ? 'is-leader' : ''}">
            <div class="ryder-team-name">
                ${settings['Team A Name']}
            </div>

            <div class="ryder-score">
                ${shaftsPoints}
            </div>
        </div>

        <div class="ryder-vs">
            v
        </div>

        <div class="ryder-team ${ballsPoints > shaftsPoints ? 'is-leader' : ''}">
            <div class="ryder-team-name">
                ${settings['Team B Name']}
            </div>

            <div class="ryder-score">
                ${ballsPoints}
            </div>
        </div>

    </div>
`;

    document
    .getElementById('rydercup')
    .innerHTML =
        scoreboard + html;

    renderTeamRecords();
}

function renderStats() {
    const statsElement = document.getElementById('stats');
    if (!statsElement) return;

    const rounds = [
        { key: 'r1', name: settings['Course 1 Name'] },
        { key: 'r2', name: settings['Course 2 Name'] },
        { key: 'r3', name: settings['Course 3 Name'] }
    ];

    const stats = {};
    const courseStats = {};
    const holeStats = Array.from({ length: 18 }, () => ({ total: 0, count: 0 }));

    Object.keys(playerHandicaps).forEach(player => {
        stats[player] = {
            gross: 0,
            net: 0,
            holes: 0,
            underPar: 0,
            birdies: 0,
            doubleBogeysPlus: 0,
            rounds: []
        };

        rounds.forEach(round => {
            if (!courseStats[round.name]) {
                courseStats[round.name] = { total: 0, count: 0 };
            }

            const rows = roundData[round.name];
            const header = rows && rows[1] ? rows[1].split(',') : [];
            const playerIndex = header.findIndex(value => value.trim() === player);
            let gross = 0;
            let net = 0;
            let parTotal = 0;
            let holes = 0;
            let birdies = 0;
            let doubleBogeysPlus = 0;

            if (rows && playerIndex !== -1) {
                const slope = courseData[round.name]?.slope || 113;
                const courseHandicap = Math.round((playerHandicaps[player] * slope) / 113);

                for (let hole = 1; hole <= 18; hole += 1) {
                    const columns = rows[hole + 1]?.split(',') || [];
                    const rawScore = columns[playerIndex]?.trim();
                    const score = Number(rawScore);
                    const par = Number(columns[1]);

                    if (!rawScore || Number.isNaN(score) || Number.isNaN(par)) continue;

                    gross += score;
                    net += score - shotsReceived(courseHandicap, Number(columns[2]));
                    parTotal += par;
                    holes += 1;

                    if (score === par - 1) birdies += 1;
                    if (score >= par + 2) doubleBogeysPlus += 1;

                    holeStats[hole - 1].total += score;
                    holeStats[hole - 1].count += 1;
                }
            }

            if (holes) {
                courseStats[round.name].total += gross / holes * 18;
                courseStats[round.name].count += 1;
                stats[player].gross += gross;
                stats[player].net += net;
                stats[player].holes += holes;
                stats[player].underPar += parTotal - gross;
                stats[player].birdies += birdies;
                stats[player].doubleBogeysPlus += doubleBogeysPlus;
                stats[player].rounds.push({ name: round.name, gross, net, holes, toPar: gross - parTotal });
            }
        });
    });

    const players = Object.entries(stats)
        .filter(([, data]) => data.holes)
        .sort((a, b) => a[1].gross - b[1].gross);

    if (!players.length) {
        statsElement.innerHTML = '<p class="empty-state">Stats will appear once scores are entered.</p>';
        return;
    }

    const roundScores = players
        .flatMap(([player, data]) => data.rounds.map(round => ({ player, ...round })))
        .sort((a, b) => a.gross - b.gross);
    const lowestGross = roundScores[0];
    const highestGross = roundScores[roundScores.length - 1];
    const lowestNet = roundScores
        .slice()
        .sort((a, b) => a.net - b.net)[0];
    const mostBirdies = players
        .slice()
        .sort((a, b) => b[1].birdies - a[1].birdies)[0];
    const mostDoubleBogeysPlus = players
        .slice()
        .sort((a, b) => b[1].doubleBogeysPlus - a[1].doubleBogeysPlus)[0];
    const courseAverages = Object.entries(courseStats)
        .filter(([, data]) => data.count)
        .map(([name, data]) => ({ name, average: data.total / data.count }))
        .sort((a, b) => b.average - a.average);
    const hardestCourse = courseAverages[0];
    const easiestCourse = courseAverages[courseAverages.length - 1];
    const holeAverages = holeStats
        .map((data, index) => ({ hole: index + 1, average: data.count ? data.total / data.count : 0, count: data.count }))
        .filter(data => data.count)
        .sort((a, b) => b.average - a.average);
    const hardestHole = holeAverages[0];
    const easiestHole = holeAverages[holeAverages.length - 1];
    const totalScoredHoles = holeStats.reduce((sum, data) => sum + data.count, 0);
    const totalStrokes = holeStats.reduce((sum, data) => sum + data.total, 0);
    const groupScoringAverage = totalScoredHoles ? totalStrokes / totalScoredHoles : 0;
    const ryderPoints = Object.values(ryderPlayerPoints);
    const bestRyderPoints = Math.max(...ryderPoints);
    const worstRyderPoints = Math.min(...ryderPoints);
    const bestRyderPlayers = Object.entries(ryderPlayerPoints)
        .filter(([, points]) => points === bestRyderPoints)
        .map(([player]) => player).join(', ');
    const worstRyderPlayers = Object.entries(ryderPlayerPoints)
        .filter(([, points]) => points === worstRyderPoints)
        .map(([player]) => player).join(', ');

    statsElement.innerHTML = `
        <div class="stats-highlights">
            <div class="stat-highlight">
                <span class="stat-label">Lowest Gross</span>
                <strong>${lowestGross.player}</strong>
                <span>${lowestGross.name} · ${lowestGross.gross}</span>
            </div>
            <div class="stat-highlight">
                <span class="stat-label">Highest Gross</span>
                <strong>${highestGross.player}</strong>
                <span>${highestGross.name} · ${highestGross.gross}</span>
            </div>
            <div class="stat-highlight">
                <span class="stat-label">Best Net Score</span>
                <strong>${lowestNet.player}</strong>
                <span>${lowestNet.name} · ${lowestNet.net}</span>
            </div>
            <div class="stat-highlight">
                <span class="stat-label">Most Birdies</span>
                <strong>${mostBirdies[0]}</strong>
                <span>${mostBirdies[1].birdies} birdies</span>
            </div>
            <div class="stat-highlight">
                <span class="stat-label">Most Doubles or Worse</span>
                <strong>${mostDoubleBogeysPlus[0]}</strong>
                <span>${mostDoubleBogeysPlus[1].doubleBogeysPlus} double bogeys or worse</span>
            </div>
            <div class="stat-highlight stat-highlight-ryder">
                <span class="stat-label">Best Ryder Cup Player</span>
                <strong>${bestRyderPlayers || 'No completed matches'}</strong>
                <span>${bestRyderPoints} point${bestRyderPoints === 1 ? '' : 's'} secured</span>
            </div>
            <div class="stat-highlight stat-highlight-ryder">
                <span class="stat-label">Worst Ryder Cup Player</span>
                <strong>${worstRyderPlayers || 'No completed matches'}</strong>
                <span>${worstRyderPoints} point${worstRyderPoints === 1 ? '' : 's'} secured</span>
            </div>
            <div class="stat-highlight stat-highlight-group">
                <span class="stat-label">Biggest Winning Margin</span>
                <strong>${biggestRyderWin ? biggestRyderWin.players : 'No completed matches'}</strong>
                <span>${biggestRyderWin ? `${biggestRyderWin.team} · ${biggestRyderWin.result}` : ''}</span>
            </div>
        </div>
        <div class="stats-group">
            <h3>Group Stats</h3>
            <div class="stats-highlights">
                <div class="stat-highlight stat-highlight-group">
                    <span class="stat-label">Group Scoring Average</span>
                    <strong>${groupScoringAverage.toFixed(2)}</strong>
                    <span>strokes per scored hole</span>
                </div>
                <div class="stat-highlight stat-highlight-group">
                    <span class="stat-label">Hardest Course</span>
                    <strong>${hardestCourse.name}</strong>
                    <span>${hardestCourse.average.toFixed(1)} average strokes</span>
                </div>
                <div class="stat-highlight stat-highlight-group">
                    <span class="stat-label">Easiest Course</span>
                    <strong>${easiestCourse.name}</strong>
                    <span>${easiestCourse.average.toFixed(1)} average strokes</span>
                </div>
                <div class="stat-highlight stat-highlight-group">
                    <span class="stat-label">Hardest Hole</span>
                    <strong>Hole ${hardestHole.hole}</strong>
                    <span>${hardestHole.average.toFixed(2)} average strokes</span>
                </div>
                <div class="stat-highlight stat-highlight-group">
                    <span class="stat-label">Easiest Hole</span>
                    <strong>Hole ${easiestHole.hole}</strong>
                    <span>${easiestHole.average.toFixed(2)} average strokes</span>
                </div>
            </div>
        </div>
        <div class="stats-table-wrap">
            <table class="stats-table">
                <tr><th>Player</th><th>Holes</th><th>Gross</th><th>To par</th></tr>
                ${players.map(([player, data]) => `
                    <tr>
                        <td>${player}</td>
                        <td>${data.holes}</td>
                        <td><strong>${data.gross}</strong></td>
                        <td>${-data.underPar > 0 ? '+' : ''}${-data.underPar}</td>
                    </tr>
                `).join('')}
            </table>
        </div>
    `;
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

    const value =
        holeRow[playerIndex]?.trim();

    if (!value)
        return null;

    return Number(value);
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

    if (gross === null)
        return null;

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
    hole
) {

    const teamANetScores = teamA.map(player => {

        const ch =
            getCourseHandicap(
                player,
                courseName
            );

        return getNetScore(
            rows,
            player,
            hole,
            ch
        );

    });

    const teamBNetScores = teamB.map(player => {

        const ch =
            getCourseHandicap(
                player,
                courseName
            );

        return getNetScore(
            rows,
            player,
            hole,
            ch
        );

    });

    const validA =
    teamANetScores.filter(
        score => score !== null
    );

const validB =
    teamBNetScores.filter(
        score => score !== null
    );

const bestA =
    Math.min(...validA);

const bestB =
    Math.min(...validB);

    if (bestA < bestB)
        return 'A';

    if (bestB < bestA)
        return 'B';

    return 'HALVED';
}

function calculateSinglesHole(
    rows,
    courseName,
    playerA,
    playerB,
    hole
) {

    const chA =
        getCourseHandicap(
            playerA,
            courseName
        );

    const chB =
        getCourseHandicap(
            playerB,
            courseName
        );

    const netA =
        getNetScore(
            rows,
            playerA,
            hole,
            chA
        );

    const netB =
        getNetScore(
            rows,
            playerB,
            hole,
            chB
        );

    if (
        netA === null ||
        netB === null
    ) {
        return null;
    }

    if (netA < netB)
        return 'A';

    if (netB < netA)
        return 'B';

    return 'HALVED';
}

function calculateSinglesMatch(
    rows,
    courseName,
    playerA,
    playerB
) {

    let lead = 0;
    let holesPlayed = 0;
    let started = false;

    for (let hole = 1; hole <= 18; hole++) {

        const scoreA =
            getPlayerHoleScore(
                rows,
                playerA,
                hole
            );

         const scoreB =
            getPlayerHoleScore(
                rows,
                playerB,
                hole
            );

        const holeHasScores =
            scoreA !== null ||
            scoreB !== null;

        if (!holeHasScores)
            break;

        started = true;
        holesPlayed++;

       const result =
    calculateSinglesHole(
        rows,
        courseName,
        playerA,
        playerB,
        hole
    );

if (result === null)
    break;

if (result === 'A')
    lead++;

if (result === 'B')
    lead--;
        
        const holesRemaining =
            18 - holesPlayed;

        if (
            holesRemaining > 0 &&
            Math.abs(lead) > holesRemaining
        ) {

            return {
                status: 'finished',
                winner:
                    lead > 0
                        ? 'A'
                        : 'B',
                result:
                    `${Math.abs(lead)}&${holesRemaining}`
            };
        }
    }

    if (!started) {

        return {
            status: 'not-started',
            result: 'Not Started'
        };
    }

    if (holesPlayed < 18) {

        if (lead === 0) {

            return {
                status: 'live',
                result:
                    `All Square Through ${holesPlayed}`
            };
        }

        return {
            status: 'live',
            result:
                `${Math.abs(lead)} Up Through ${holesPlayed}`
        };
    }

    if (lead === 0) {

        return {
            status: 'finished',
            winner: 'Halved',
            result: 'Match Halved'
        };
    }

    return {
        status: 'finished',
        winner:
            lead > 0
                ? 'A'
                : 'B',
        result:
            `${Math.abs(lead)} Up`
    };
}

function calculateFourballMatch(
    rows,
    courseName,
    teamA,
    teamB
) {

    let lead = 0;
    let holesPlayed = 0;
    let started = false;

    for (let hole = 1; hole <= 18; hole++) {

        const scores = [

            getPlayerHoleScore(
                rows,
                teamA[0],
                hole
            ),

            getPlayerHoleScore(
                rows,
                teamA[1],
                hole
            ),

            getPlayerHoleScore(
                rows,
                teamB[0],
                hole
            ),

            getPlayerHoleScore(
                rows,
                teamB[1],
                hole
            )

        ];

       const holeHasScores =
        scores.some(
        score => score > 0
    );

        if (!holeHasScores)
            break;

        if (!holeHasScores)
    break;

started = true;
holesPlayed++;

        const result =
            calculateFourballHole(
                rows,
                courseName,
                teamA,
                teamB,
                hole
            );

        if (result === 'A')
            lead++;

        if (result === 'B')
            lead--;

        const holesRemaining =
            18 - holesPlayed;

       if (
        holesRemaining > 0 &&
        Math.abs(lead) > holesRemaining
        ) {

            const winner =
            lead > 0
            ? 'A'
            : 'B';

            return {
                status: 'finished',
                winner,
                result:
                    `${Math.abs(lead)}&${holesRemaining}`
            };
        }
    }

    if (!started) {

        return {
            status: 'not-started',
            result: 'Not Started'
        };
    }

    if (holesPlayed < 18) {

        if (lead === 0) {

            return {
                status: 'live',
                result:
                    `All Square Through ${holesPlayed}`
            };
        }

        return {
            status: 'live',
            result:
                `${lead > 0 ? 'Balls' : 'Shafts'} ` +
                `${Math.abs(lead)} Up Through ${holesPlayed}`
        };
    }

    if (lead === 0) {

        return {
            status: 'finished',
            winner: 'Halved',
            result: 'Match Halved'
        };
    }

    return {
    status: 'finished',
    winner:
        lead > 0
            ? 'A'
            : 'B',
    result:
        `${Math.abs(lead)} Up`
    };

}

async function loadScorecardPlayers() {

    const response =
        await fetch(PLAYER_CSV);

    const text =
        await response.text();

    const rows =
        text.split('\n').slice(1);

    let html = '';

    rows.forEach(row => {

        if (!row.trim()) return;

        const cols =
            row.split(',');

        html += `
            <option>
                ${cols[0]}
            </option>
        `;
    });

    document
        .getElementById(
            'scorecardPlayer'
        )
        .innerHTML = html;
}

function getHolePar(
    courseName,
    holeNumber
) {

    const rows =
        roundData[courseName];

    const holeRow =
        rows[holeNumber + 1].split(',');

    return Number(
        holeRow[1]
    );
}

function formatGrossScore(score, par) {
    if (score === null || score === undefined) return '-';

    const difference = score - par;
    const notation = difference <= -2
        ? 'score-eagle'
        : difference === -1
            ? 'score-birdie'
            : difference === 1
                ? 'score-bogey'
                : difference >= 2
                    ? 'score-double-bogey'
                    : '';

    return notation
        ? `<span class="score-symbol ${notation}">${score}</span>`
        : `<span class="score-symbol">${score}</span>`;
}

function renderScorecard() {

    const player =
        document.getElementById(
            'scorecardPlayer'
        ).value;

    const round =
        document.getElementById(
            'scorecardCourse'
        ).value;

    let courseName;

    if (round === '1')
        courseName =
            settings['Course 1 Name'];

    if (round === '2')
        courseName =
            settings['Course 2 Name'];

    if (round === '3')
        courseName =
            settings['Course 3 Name'];

    const rows =
        roundData[courseName];

    if (!rows) return;

    let frontPar = 0;
let backPar = 0;

let frontScore = 0;
let backScore = 0;

let html = `
<div class="scorecard-header">

    <h3>${player}</h3>

    <div class="scorecard-course">
        ${courseName}
    </div>

</div>

<table class="scorecard-table">

<tr>
    <th>Hole</th>
`;

for (let hole = 1; hole <= 9; hole++) {

    html += `<th>${hole}</th>`;
}

html += `<th>OUT</th></tr>`;

html += `<tr><td>Par</td>`;

for (let hole = 1; hole <= 9; hole++) {

    const par =
        getHolePar(
            courseName,
            hole
        );

    frontPar += par;

    html += `<td>${par}</td>`;
}

html += `<td>${frontPar}</td></tr>`;

html += `<tr><td>Score</td>`;

for (let hole = 1; hole <= 9; hole++) {

    const par =
        getHolePar(
            courseName,
            hole
        );

    const score =
        getPlayerHoleScore(
            rows,
            player,
            hole
        );

    frontScore +=
        Number(score || 0);

    html += `<td>${formatGrossScore(score, par)}</td>`;
}

html += `<td>${frontScore}</td></tr>`;

html += `</table><br>`;

html += `
<table class="scorecard-table">

<tr>
    <th>Hole</th>
`;

for (let hole = 10; hole <= 18; hole++) {

    html += `<th>${hole}</th>`;
}

html += `<th>IN</th></tr>`;

html += `<tr><td>Par</td>`;

for (let hole = 10; hole <= 18; hole++) {

    const par =
        getHolePar(
            courseName,
            hole
        );

    backPar += par;

    html += `<td>${par}</td>`;
}

html += `<td>${backPar}</td></tr>`;

html += `<tr><td>Score</td>`;

for (let hole = 10; hole <= 18; hole++) {

    const par =
        getHolePar(
            courseName,
            hole
        );

    const score =
        getPlayerHoleScore(
            rows,
            player,
            hole
        );

    backScore +=
        Number(score || 0);

    html += `<td>${formatGrossScore(score, par)}</td>`;
}

html += `<td>${backScore}</td></tr>`;

html += `</table>`;

html += `
<div class="scorecard-summary">

    Gross:
    ${frontScore + backScore}

</div>
`;

document
    .getElementById('scorecard')
    .innerHTML = html;
}

async function initialise() {

    await loadSettings();

    loadVillaInfo();

    loadScorecardCourses();

    await loadCourseData();

    loadCourseSelector();

    await loadScorecardPlayers();

    renderSchedule();

    await loadTeams();

    buildLeaderboard();

    loadHandicaps();

    await calculateRound1Leaderboard();

    renderStats();

    renderScorecard();

    document
    .getElementById('courseSelect')
    .addEventListener(
        'change',
        () => loadHandicaps()
    );

    document
    .getElementById('scorecardPlayer')
    .addEventListener(
        'change',
        () => renderScorecard()
    );

    document
    .getElementById('scorecardCourse')
    .addEventListener(
        'change',
        () => renderScorecard()
    );
}

initialise();         
