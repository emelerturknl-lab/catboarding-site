import urllib.request
response = urllib.request.urlopen("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2").read().decode('utf-8')
print("window.supabase" in response)
print("exports.createClient" in response)
