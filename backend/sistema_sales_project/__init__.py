# SISTEMA_SALES S.A.
# Configuración de compatibilidad para MySQL mediante PyMySQL
try:
    import pymysql
    pymysql.install_as_MySQLdb()
except ImportError:
    pass
