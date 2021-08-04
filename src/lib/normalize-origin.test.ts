import normalizeOrigin from "./normalize-origin";

describe('allowed origin normalizer', () => {
  it('should normalize multimatch keyword', () => {
    const input = ['*'].join('\n')
    const output = normalizeOrigin(input);
    expect(output).toEqual(['*']);
  })

  it('should normalize URL with trailing slash', () => {
    const input = ['https://example.com/'].join('\n')
    const output = normalizeOrigin(input);
    expect(output).toEqual(['https://example.com']);
  })

  it('should normalize URL with heading and trailing whitespaces', () => {
    const input = ['     https://example.com   '].join('\n')
    const output = normalizeOrigin(input);
    expect(output).toEqual(['https://example.com']);
  })

  it('should normalize URL of subdomain', () => {
    const input = ['https://www.a.b.c.d.e.f.example.com'].join('\n')
    const output = normalizeOrigin(input);
    expect(output).toEqual(['https://www.a.b.c.d.e.f.example.com']);
  })

  it('should normalize URL with unicode domain', () => {
    const input = ['https://www.ジオロニア.com'].join('\n')
    const output = normalizeOrigin(input);
    expect(output).toEqual(['https://www.ジオロニア.com']);
  })

  it('should normalize URL with port, dirctory, querystring and hash.', () => {
    const input = ['https://example.com:8000/hello/world?query=hello#aaaaa'].join('\n')
    const output = normalizeOrigin(input);
    expect(output).toEqual(['https://example.com:8000/hello/world?query=hello#aaaaa']);
  })

  it('should normalize localhost', () => {
    const input = [
      'http://localhost:1234',
      'http://127.0.0.1:8080',
    ].join('\n');
    const output = normalizeOrigin(input);
    expect(output).toEqual([
      'http://localhost:1234',
      'http://127.0.0.1:8080',
    ]);
  })

  it('should remove duplicate entries', () => {
    const input = ['https://example.com/', 'https://example.com'].join('\n');
    const output = normalizeOrigin(input);
    expect(output).toEqual(['https://example.com']);
  });

  it('should remove invalid origin', () => {
    const input = ['foo', 'https://example.com'].join('\n');
    const output = normalizeOrigin(input);
    expect(output).toEqual(['https://example.com']);
  });

  it('should normalize URLs with asterisk', () => {
    const input = [
      'https://*.example.com/',
      'http://127.0.0.1:*',
      'http://localhost:*',
    ].join('\n');
    const output = normalizeOrigin(input);
    expect(output).toEqual([
      'https://*.example.com',
      'http://127.0.0.1:*',
      'http://localhost:*',
    ]);
  });

  it('should normalize empty array', () => {
    const input = [].join('\n');
    const output = normalizeOrigin(input);
    expect(output).toEqual([]);
  });
})
