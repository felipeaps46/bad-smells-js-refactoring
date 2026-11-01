class CsvFormatter {
  header() {
    return 'ID,NOME,VALOR,USUARIO\n';
  }

  row(item, user) {
    return `${item.id},${item.name},${item.value},${user.name}\n`;
  }

  footer(total) {
    return `\nTotal,,\n${total},,\n`;
  }
}

class HtmlFormatter {
  header(user) {
    let header = '<html><body>\n';
    header += '<h1>Relatório</h1>\n';
    header += `<h2>Usuário: ${user.name}</h2>\n`;
    header += '<table>\n';
    header += '<tr><th>ID</th><th>Nome</th><th>Valor</th></tr>\n';
    return header;
  }

  row(item, user) {
    let style = '';
    if (user.role === 'ADMIN' && item.value > 1000) {
      style = ' style="font-weight:bold;"';
    }
    return `<tr${style}><td>${item.id}</td><td>${item.name}</td><td>${item.value}</td></tr>\n`;
  }

  footer(total) {
    let footer = '</table>\n';
    footer += `<h3>Total: ${total}</h3>\n`;
    footer += '</body></html>\n';
    return footer;
  }
}

export class ReportGenerator {
  generateReport(reportType, user, items) {
    const formatter = this.getFormatter(reportType);
    if (!formatter) {
      return '';
    }

    let report = formatter.header(user);
    let total = 0;

    for (const item of items) {
      if (this.canSee(user, item)) {
        report += formatter.row(item, user);
        total += item.value;
      }
    }

    report += formatter.footer(total);
    return report.trim();
  }

  getFormatter(reportType) {
    if (reportType === 'CSV') {
      return new CsvFormatter();
    }
    if (reportType === 'HTML') {
      return new HtmlFormatter();
    }
    return null;
  }

  canSee(user, item) {
    if (user.role === 'ADMIN') {
      return true;
    }
    if (user.role === 'USER') {
      return item.value <= 500;
    }
    return false;
  }
}
