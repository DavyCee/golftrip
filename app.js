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

async function loadTeams() {

    const response =
        await fetch(PLAYER_CSV);

    const text =
        await response.text();

    const rows =
        text.split('\n');

    const teamA = [];
    const teamB = [];

    let captainA = '';
    let captainB = '';

    rows.slice(1).forEach(row => {

        const cols =
            row.split(',')
                .map(x => x.trim());

        if (!cols[0]) return;

        const playerName = cols[0];
        const teamName = cols[2];

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
                `<div>${player}</div>`
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
                `<div>${player}</div>`
                )
                .join('')}

            </div>

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
    'ROUND DATA KEYS',
    Object.keys(roundData)
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

    loadRyderCup();
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

    let ballsPoints = 0;
    let shaftsPoints = 0;

    let html = '';

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

    if (result.winner === 'A') {

        ballsPoints += Number(
            settings['Ryder Cup Points Win']
        );

    } else if (result.winner === 'B') {

        shaftsPoints += Number(
            settings['Ryder Cup Points Win']
        );

    } else if (result.winner === 'Halved') {

        ballsPoints += Number(
            settings['Ryder Cup Points Half']
        );

        shaftsPoints += Number(
            settings['Ryder Cup Points Half']
        );
    }
}

status = result.result;

if (
    result.status === 'finished' &&
    result.winner &&
    result.winner !== 'Halved'
) {

   const winnerName =
    result.winner === 'A'
        ? settings['Team A Name']
        : settings['Team B Name'];

status =
    `${winnerName} Won ${result.result}`;
    
}

} catch (e) {

    console.error(e);

    status = 'ERROR';

}

html += `
    <div class="fixture">
        <strong>${cols[0]}</strong><br>

        <strong>${settings['Team A Name']}</strong><br>
        ${cols[1]} / ${cols[2]}

        <br><br>

        vs

        <br><br>

        <strong>${settings['Team B Name']}</strong><br>
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
            
let singlesStatus = 'Not Started';

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

   if (result.status === 'finished') {

    if (result.winner === 'A') {

        ballsPoints += Number(
            settings['Ryder Cup Points Win']
        );

        singlesStatus =
            `${settings['Team A Name']} Won ${result.result}`;

    } else if (result.winner === 'B') {

        shaftsPoints += Number(
            settings['Ryder Cup Points Win']
        );

        singlesStatus =
            `${settings['Team B Name']} Won ${result.result}`;

    } else {

        ballsPoints += Number(
            settings['Ryder Cup Points Half']
        );

        shaftsPoints += Number(
            settings['Ryder Cup Points Half']
        );

        singlesStatus = result.result;
    }

} else {

    singlesStatus = result.result;
}
} catch (e) {

    singlesStatus = 'Not Started';

}

    html += `
        <div class="fixture">
            <strong>${cols[0]}</strong><br>

            <strong>${settings['Team A Name']}</strong><br>
            ${cols[1]}

            <br><br>

            vs

            <br><br>

            <strong>${settings['Team B Name']}</strong><br>
            ${cols[2]}

            <br>

            <em>${singlesStatus}</em>

            <br><br>
        </div>
    `;
}
    });

    ryderCupMatches = matches;

const scoreboard = `
    <div class="ryder-scoreboard">

        <div class="ryder-team">
            <div class="ryder-team-name">
                ${settings['Team A Name']}
            </div>

            <div class="ryder-score">
                ${ballsPoints}
            </div>
        </div>

        <div class="ryder-vs">
            v
        </div>

        <div class="ryder-team">
            <div class="ryder-team-name">
                ${settings['Team B Name']}
            </div>

            <div class="ryder-score">
                ${shaftsPoints}
            </div>
        </div>

    </div>
`;

    document
    .getElementById('rydercup')
    .innerHTML =
        scoreboard + html;
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

    const slope =
        courseData[courseName].slope;

    const hiA =
        playerHandicaps[playerA];

    const hiB =
        playerHandicaps[playerB];

    const chA =
        Math.round(
            (hiA * slope) / 113
        );

    const chB =
        Math.round(
            (hiB * slope) / 113
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
        return 'HALVED';
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
<h3>${player}</h3>
<p>${courseName}</p>

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

    const score =
        getPlayerHoleScore(
            rows,
            player,
            hole
        );

    frontScore +=
        Number(score || 0);

    html += `<td>${score || '-'}</td>`;
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

    const score =
        getPlayerHoleScore(
            rows,
            player,
            hole
        );

    backScore +=
        Number(score || 0);

    html += `<td>${score || '-'}</td>`;
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

    await loadScorecardPlayers();

    renderSchedule();

    loadTeams();

    buildLeaderboard();

    loadHandicaps();

    await calculateRound1Leaderboard();

    loadRyderCup();

    renderScorecard();
    
    document
        .getElementById('courseSelect')
        .addEventListener(
            'change',
            loadHandicaps
        );
}

initialise();
