"""Genera el ZIP para la Chrome Web Store en dist/.

Uso: python build-zip.py

Incluye solo los archivos de la extensión (sin test/, store/, graphify-out/,
.claude/...), con rutas '/' y manifest.json en la raíz. Falla si falta algo
que el manifest referencia.
"""
import json
import os
import zipfile

FILES = ['manifest.json', 'background.js', 'content.js', 'content.css',
         'popup.html', 'popup.js', 'popup.css', 'rules.json']


def manifest_refs(m):
    refs = {m['background']['service_worker'], m['action']['default_popup']}
    refs |= set(m['icons'].values()) | set(m['action']['default_icon'].values())
    refs |= {r['path'] for r in m['declarative_net_request']['rule_resources']}
    for cs in m['content_scripts']:
        refs |= set(cs['js']) | set(cs['css'])
    return refs


def main():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    m = json.load(open('manifest.json', encoding='utf-8'))
    files = FILES + ['icons/' + f for f in sorted(os.listdir('icons'))]
    missing = manifest_refs(m) - set(files)
    assert not missing, 'faltan en el ZIP: %s' % missing
    absent = [f for f in files if not os.path.isfile(f)]
    assert not absent, 'no existen: %s' % absent

    os.makedirs('dist', exist_ok=True)
    out = 'dist/chat-sidebar-adjuster-v%s.zip' % m['version']
    with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as z:
        for f in files:
            z.write(f, f)

    with zipfile.ZipFile(out) as z:  # verificación del paquete final
        names = z.namelist()
        assert 'manifest.json' in names and not any('\\' in n for n in names)
        json.loads(z.read('rules.json'))
    print('%s (%d bytes, %d archivos)' % (out, os.path.getsize(out), len(names)))


if __name__ == '__main__':
    main()
