import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { writeFile, unlink } from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

export async function POST(req: Request) {
  const { code, language } = await req.json();

  if (!code || !language) {
    return NextResponse.json({ error: 'Code and language are required' }, { status: 400 });
  }

  const fileName = `${uuidv4()}.${language === 'python' ? 'py' : 'js'}`;
  const filePath = path.join(process.cwd(), 'tmp', fileName);

  try {
    await writeFile(filePath, code);

    const output = await new Promise<string>((resolve, reject) => {
      exec(
        `${language === 'python' ? 'python' : 'node'} ${filePath}`,
        { timeout: 5000 },
        (error, stdout, stderr) => {
          if (error) {
            reject(error);
          } else {
            resolve(stdout || stderr);
          }
        }
      );
    });

    await unlink(filePath);

    return NextResponse.json({ output });
  } catch (error) {
    console.error('Error executing code:', error);
    return NextResponse.json({ error: 'Error executing code' }, { status: 500 });
  }
}

