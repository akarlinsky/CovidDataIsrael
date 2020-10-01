const {
    ButtonGroup, Button, Icon, Grid, IconButton, CircularProgress, Link
} = MaterialUI;

let sheetname = new URL(window.location.href).searchParams.get("sheet");
sheetname = sheetname || 'showcharts';
console.log(sheetname);

const ShowByName = ({ name, names, lang }) => {
    if (name === 'showcharts') return <DataShowCharts names={names} lang={lang} />
    if (name === 'infectedVsDead') return <DataShowComputedDeath showtable={true} lang={lang} />
    return <DataShow name={name} lang={lang} />
}

let languages;
let names = [];

const trans = (lang, text) => {
    if (!lang) return '';
    if (lang[text]) return lang[text];
    const nospaces = lang[text.replace(/[ _]/g, '')];
    if (lang[nospaces]) return lang[nospaces];
    return text;
}

const App = ({ name }) => {
    const [lastUpdate, setLastUpdate] = React.useState('...');
    const [language, setLanguage] = React.useState('he');

    (async () => {
        const last = await fetchCsv(`out/csv/lastUpdate.csv`);
        if (last && last.length && last[0].lastUpdate) {
            setLastUpdate(last[0].lastUpdate.toLocaleString('en-GB', { hour12: false }));
        }
    })();

    const lang = languages[language];

    return <>
        <Grid container direction="row">
            <Grid item xs={3}>
                <Grid container direction="row" justify="flex-start" alignItems="center">
                    <IconButton onClick={() => setLanguage(language === 'he' ? 'en' : 'he')}>
                        <img width={32} height={32} src={`images/${language === 'he' ? 'il' : 'gb'}.svg`}></img>
                    </IconButton>
                    <p style={{
                        fontFamily: 'Source Sans Pro, sans-serif',
                        textAlign: 'left',
                    }}>
                        {trans(lang, 'lastUpdate')}<br />
                        {lastUpdate}
                    </p>
                </Grid>
            </Grid>
            <Grid item xs={6}>
                <h1 style={{
                    // fontFamily: 'Source Sans Pro, sans-serif',
                    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                    textAlign: 'center',
                    fontSize: 'xx-large'
                }}>
                    {trans(lang, 'Covid-19 Data Israel')}
                </h1>
            </Grid>
            <Grid item xs={3}>
                <Link href="https://eran.dev/" style={{ textDecoration: 'none' }} target="_blank" >
                    <p style={{
                        fontFamily: 'Source Sans Pro, sans-serif',
                        textAlign: 'right',
                        marginRight: 10
                    }}>
                        {trans(lang, 'Contact')}
                    </p>
                </Link>
            </Grid>
        </Grid>
        <Grid container direction="row">
            <Grid item xs={3}>
                <CsvButtons names={names} lang={lang} />
            </Grid>
            <Grid item xs={9}>
                <ShowByName name={name} names={names} lang={lang} />
            </Grid>
        </Grid>
        <p style={{
            fontFamily: 'Source Sans Pro, sans-serif',
            textAlign: 'center',
        }}>
            Updated hourly from the&nbsp;
            <Link href='https://www.health.gov.il/English/Pages/HomePage.aspx' style={{ textDecoration: 'none' }} target="_blank" rel="noopener">
                public API of Ministry of Health of Israel
            </Link>
            <br />
            Created by&nbsp;
             <Link href="https://eran.dev/" style={{ textDecoration: 'none' }} target="_blank" >
                © Eran Geva
            </Link>
            &nbsp;as&nbsp;
            <Link href='https://github.com/erasta/CovidDataIsrael' style={{ textDecoration: 'none' }} target="_blank" rel="noopener">
                open-source code
            </Link>
        </p>
    </>
}

(async () => {
    let [langs1, names1, names2, names3] = await Promise.all([
        await (await fetch('jsons/lang.json')).json(),
        await (await fetch('jsons/dashreq.json')).json(),
        await (await fetch('jsons/dashcomputed.json')).json(),
        await (await fetch('jsons/mohfiles.json')).json()
    ]);

    languages = langs1;
    names = names1.requests.map(j => j.queryName).concat(names2).concat(names3.map(r => r.name));

    ReactDOM.render(
        <App name={sheetname} />,
        document.getElementById('root')
    );
})()