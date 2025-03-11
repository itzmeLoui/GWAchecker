def condition_variables():
    return render_template('condition-variables.html')
@app.route('/gwa-checker')
def gwa_checker():
    return render_template('gwa-checker.html')
# Simple API endpoint for checking if server is alive
@app.route('/api/health')
def health_check():
