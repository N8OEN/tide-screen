function mySettings(props) {
  if (props.settingsStorage.getItem("error") == 1) {
    return (
      <Page>
        <Section
          title={<Text bold align="center" color="red">ERROR: INVALID STATION/PORT</Text>}>
          <Text align="center">It looks like you chose an invalid combination. Please reselect region and/or re-enter station/port ID</Text>
          <Text>If you are requesting UK tides, you may have selected a port ID outside of the United Kingdom. If you are requesting NOAA tides, you may have selected a Meteorological, Current, or Air Gap station ID. Only Water level or Water Level and Met stations work with this clock face.</Text>
        </Section>
        <Section
          title={<Text bold align="center">Select your region and station/port ID:</Text>}>
          <Text align="center">Note: it may take up to one minute for your clock face to update to the new tides</Text>
          <Select
            label={`Region`}
            settingsKey="regionInput"
            options={[
              {name:"US & territories", value:"0"},
              {name:"United Kingdom", value:"1"}
            ]}
          />
          <TextInput
            label="Station/Port ID"
            placeholder="9414290"
            title="Text Input"
            settingsKey="stationInput"
          />
        </Section>
        <Section
          title={<Text bold align="center">Find your station/port ID here:</Text>}>
          <Link source="https://tidesandcurrents.noaa.gov/map/">NOAA tides and currents map</Link>
                <Text>Follow tihis link to visit the NOAA website, where you can select tide and current buoys accessible through the CO-OPS API. Note that the selected station must report water levels, or water levels and meteorology. Current stations or meteorology only stations do not provide data necessary for tide clock to work. This works for the United States and some territories only.</Text>
                  <Link source="http://www.ukho.gov.uk/easytide/easytide/SelectPort.aspx">United Kingdom tides</Link>
                <Text>Follow this link to visit the UKHO website, where you can select tide and current buoys accessible through the Admiralty API. You can use the map or search function to find your local port. Select your desired port, and click on the URL. the URL ends with the port ID. For instance the Blackpool URL ends in "PortID=0445". If you want Blackpool tides, input 0445 into the Station/Port ID. This works for the United Kingdom only.</Text>
        </Section>
      </Page>
      );
  } else {
    return (
      <Page>
        <Section
          title={<Text bold align="center">Select your region and station/port ID</Text>}>
          <Text align="center">Note: it may take up to one minute for your clock face to update to the new tides</Text>
          <Select
            label={`Region`}
            settingsKey="regionInput"
            options={[
              {name:"US & territories", value:"0"},
              {name:"United Kingdom", value:"1"}
            ]}
          />
          <TextInput
            label="Station/Port ID"
            placeholder="9414290"
            title="Text Input"
            settingsKey="stationInput"
          />
        </Section>
        <Section
          title={<Text bold align="center">Find your station/port ID here:</Text>}>
          <Link source="https://tidesandcurrents.noaa.gov/map/">NOAA tides and currents map</Link>
                <Text>Follow tihis link to visit the NOAA website, where you can select tide and current buoys accessible through the CO-OPS API. Note that the selected station must report water levels, or water levels and meteorology. Current stations or meteorology only stations do not provide data necessary for tide clock to work. This works for the United States and some territories only.</Text>
                  <Link source="http://www.ukho.gov.uk/easytide/easytide/SelectPort.aspx">United Kingdom tides</Link>
                <Text>Follow this link to visit the UKHO website, where you can select tide and current buoys accessible through the Admiralty API. You can use the map or search function to find your local port. Select your desired port, and click on the URL. the URL ends with the port ID. For instance the Blackpool URL ends in "PortID=0445". If you want Blackpool tides, input 0445 into the Station/Port ID. This works for the United Kingdom only.</Text>
        </Section>
      </Page>
    );
  }
}

registerSettingsPage(mySettings);