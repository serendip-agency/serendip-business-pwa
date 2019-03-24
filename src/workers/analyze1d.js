self.module = {
  exports: function(params, done) {
    ["moment", "moment-jalaali", "underscore"].forEach(lib =>
      importScripts(location.origin + "/workers/lib/" + lib + ".js")
    );
    params = JSON.parse(params);

    const formatOptions = params._formatOptions;

    const r = params._input.report;

    r.data = _.groupBy(r.data, p => p[formatOptions.groupBy.name]);

    r.data["n/a"] =
      [...(r.data[""] || []), ...(r.data["undefined"] || [])] || [];
    delete r.data[""];
    delete r.data["undefined"];
    r.data = Object.keys(r.data).map(p => {
      return {
        name: p,
        value: r.data[p].length || 0
        //   data: r.data[p] || []
      };
    });
    r.fields = [
      { label: formatOptions.groupBy.label, name: "name", enabled: true },
      { label: "تعداد", name: "value", enabled: true }
    ];
    r.count = r.data.length;
    r.data = r.data.sort((a, b) => b.value - a.value);
    done(r);
  }
};
